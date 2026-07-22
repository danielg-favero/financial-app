import { InvalidPasswordError } from "@/modules/auth/domain/errors/invalid-password.error";
import { InvalidResetTokenError } from "@/modules/auth/domain/errors/invalid-reset-token.error";
import { PasswordsDontMatchError } from "@/modules/auth/domain/errors/passwords-dont-match.error";
import type { IResetPasswordDTO } from "@/modules/auth/dtos/reset-password.dto";
import type { IPasswordHasher } from "@/modules/auth/providers/password-hasher.provider";
import type { IPasswordPolicyProvider } from "../providers/password-policy.provider.ts";
import type { IRefreshTokenRepository } from "@/modules/auth/repositories/refresh-token.repository";
import type { IUserRepository } from "@/modules/auth/repositories/user.repository";
import type { IEmailSender } from "@/shared/email/email-sender.provider";
import { passwordResetConfirmationEmail } from "@/shared/email/templates/password-reset-confirmation.email";

export interface IResetPasswordServiceDeps {
  userRepository: IUserRepository;
  refreshTokenRepository: IRefreshTokenRepository;
  passwordHasher: IPasswordHasher;
  passwordPolicy: IPasswordPolicyProvider;
  emailSender: IEmailSender;
}

export class ResetPasswordService {
  private readonly userRepository: IUserRepository;
  private readonly refreshTokenRepository: IRefreshTokenRepository;
  private readonly passwordHasher: IPasswordHasher;
  private readonly passwordPolicy: IPasswordPolicyProvider;
  private readonly emailSender: IEmailSender;

  constructor({
    userRepository,
    refreshTokenRepository,
    passwordHasher,
    passwordPolicy,
    emailSender,
  }: IResetPasswordServiceDeps) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.passwordHasher = passwordHasher;
    this.passwordPolicy = passwordPolicy;
    this.emailSender = emailSender;
  }

  async execute(dto: IResetPasswordDTO): Promise<void> {
    const passwordViolations = this.passwordPolicy.getValidations(dto.password);
    if (passwordViolations.length > 0) {
      throw new InvalidPasswordError(passwordViolations[0]);
    }

    const passwordsDontMatch = dto.password !== dto.confirmPassword;
    if (passwordsDontMatch) {
      throw new PasswordsDontMatchError();
    }

    const user = await this.userRepository.findByPasswordResetToken(dto.token);
    const isExpired =
      !user?.passwordResetTokenExpiresAt ||
      user.passwordResetTokenExpiresAt.getTime() <= Date.now();
    if (!user || isExpired) {
      throw new InvalidResetTokenError();
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);
    const updatedUser = await this.userRepository.update(user.id, {
      passwordHash,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    });

    // Sign out every active session: the credential that opened them changed
    await this.refreshTokenRepository.revokeAllByUserId(user.id);

    const email = passwordResetConfirmationEmail({ firstName: updatedUser.firstName });

    try {
      await this.emailSender.send({
        to: updatedUser.email,
        subject: email.subject,
        html: email.html,
      });
    } catch (error) {
      // The reset must not fail when SMTP is unavailable
      console.error("Failed to send the password reset confirmation email", error);
    }
  }
}
