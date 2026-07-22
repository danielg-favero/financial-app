import { randomBytes } from "node:crypto";

import type { User } from "@/modules/auth/domain/entities/user";
import { EmailAlreadyInUseError } from "@/modules/auth/domain/errors/email-already-in-use.error";
import type { ICreateUserDTO } from "@/modules/auth/dtos/create-user.dto";
import type { IPasswordHasher } from "@/modules/auth/providers/password-hasher.provider";
import type { IUserRepository } from "@/modules/auth/repositories/user.repository";
import { InvalidPasswordError } from "@/modules/auth/domain/errors/invalid-password.error";
import { PasswordsDontMatchError } from "@/modules/auth/domain/errors/passwords-dont-match.error";
import type { IPasswordPolicyProvider } from "../providers/password-policy.provider.ts";
import type { IEmailSender } from "@/shared/email/email-sender.provider";
import { registerConfirmationEmail } from "@/shared/email/templates/register-confirmation.email";

export interface IRegisteredUser {
  user: User;
  verificationToken: string;
}

export interface IRegisterUserServiceDeps {
  userRepository: IUserRepository;
  passwordHasher: IPasswordHasher;
  passwordPolicy: IPasswordPolicyProvider;
  emailSender: IEmailSender;
  appUrl: string;
}

export class RegisterUserService {
  private readonly userRepository: IUserRepository;
  private readonly passwordHasher: IPasswordHasher;
  private readonly passwordPolicy: IPasswordPolicyProvider;
  private readonly emailSender: IEmailSender;
  private readonly appUrl: string;

  constructor({
    userRepository,
    passwordHasher,
    passwordPolicy,
    emailSender,
    appUrl,
  }: IRegisterUserServiceDeps) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.passwordPolicy = passwordPolicy;
    this.emailSender = emailSender;
    this.appUrl = appUrl;
  }

  async execute(dto: ICreateUserDTO): Promise<IRegisteredUser> {
    const passwordViolations = this.passwordPolicy.getValidations(dto.password);
    if (passwordViolations.length > 0) {
      throw new InvalidPasswordError(passwordViolations[0]);
    }

    const passwordsDontMatch = dto.password !== dto.confirmPassword;
    if (passwordsDontMatch) {
      throw new PasswordsDontMatchError();
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new EmailAlreadyInUseError();
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const verificationToken = randomBytes(32).toString("hex");

    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      verificationToken,
    });

    const verificationUrl = new URL("/auth/verify-email", this.appUrl);
    verificationUrl.searchParams.set("code", verificationToken);
    const email = registerConfirmationEmail({
      firstName: user.firstName,
      verificationUrl: verificationUrl.toString(),
    });

    try {
      await this.emailSender.send({
        to: user.email,
        subject: email.subject,
        html: email.html,
      });
    } catch (error) {
      // Signup must not fail when SMTP is unavailable
      console.error(
        "Failed to send the registration confirmation email",
        error,
      );
    }

    // No session is issued here: the account stays unauthenticated until the
    // email is verified, which POST /auth/signin enforces too
    return { user, verificationToken };
  }
}
