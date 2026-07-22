import { randomBytes } from "node:crypto";

import type { IForgotPasswordDTO } from "@/modules/auth/dtos/forgot-password.dto";
import type { IUserRepository } from "@/modules/auth/repositories/user.repository";
import type { IEmailSender } from "@/shared/email/email-sender.provider";
import { passwordResetEmail } from "@/shared/email/templates/password-reset.email";

export const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export interface IRequestPasswordResetServiceDeps {
  userRepository: IUserRepository;
  emailSender: IEmailSender;
  appUrl: string;
}

export class RequestPasswordResetService {
  private readonly userRepository: IUserRepository;
  private readonly emailSender: IEmailSender;
  private readonly appUrl: string;

  constructor({
    userRepository,
    emailSender,
    appUrl,
  }: IRequestPasswordResetServiceDeps) {
    this.userRepository = userRepository;
    this.emailSender = emailSender;
    this.appUrl = appUrl;
  }

  async execute(dto: IForgotPasswordDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      // Resolve silently so the endpoint doesn't reveal which emails exist
      return;
    }

    const passwordResetToken = randomBytes(32).toString("hex");
    await this.userRepository.update(user.id, {
      passwordResetToken,
      passwordResetTokenExpiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS),
    });

    const resetUrl = new URL("/auth/reset-password", this.appUrl);
    resetUrl.searchParams.set("code", passwordResetToken);
    const email = passwordResetEmail({
      firstName: user.firstName,
      resetUrl: resetUrl.toString(),
    });

    try {
      await this.emailSender.send({
        to: user.email,
        subject: email.subject,
        html: email.html,
      });
    } catch (error) {
      // The response is 204 either way (anti-enumeration), so only log
      console.error("Failed to send the password reset email", error);
    }
  }
}
