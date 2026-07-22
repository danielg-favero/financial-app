import type { User } from "@/modules/auth/domain/entities/user";
import { InvalidVerificationTokenError } from "@/modules/auth/domain/errors/invalid-verification-token.error";
import type { IVerifyEmailDTO } from "@/modules/auth/dtos/verify-email.dto";
import type { IUserRepository } from "@/modules/auth/repositories/user.repository";
import type { IEmailSender } from "@/shared/email/email-sender.provider";
import { emailVerificationConfirmationEmail } from "@/shared/email/templates/email-verification-confirmation.email";

export interface IVerifyEmailServiceDeps {
  userRepository: IUserRepository;
  emailSender: IEmailSender;
}

export class VerifyEmailService {
  private readonly userRepository: IUserRepository;
  private readonly emailSender: IEmailSender;

  constructor({ userRepository, emailSender }: IVerifyEmailServiceDeps) {
    this.userRepository = userRepository;
    this.emailSender = emailSender;
  }

  async execute(dto: IVerifyEmailDTO): Promise<User> {
    const user = await this.userRepository.findByVerificationToken(dto.token);
    if (!user) {
      throw new InvalidVerificationTokenError();
    }

    const verifiedUser = await this.userRepository.update(user.id, {
      emailVerified: true,
      verificationToken: null,
    });

    const email = emailVerificationConfirmationEmail({ firstName: verifiedUser.firstName });

    try {
      await this.emailSender.send({
        to: verifiedUser.email,
        subject: email.subject,
        html: email.html,
      });
    } catch (error) {
      // Verification must not fail when SMTP is unavailable
      console.error("Failed to send the email verification confirmation email", error);
    }

    return verifiedUser;
  }
}
