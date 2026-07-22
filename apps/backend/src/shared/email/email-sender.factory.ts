import type { IEnv } from "@/shared/config/env";
import type { IEmailSender } from "@/shared/email/email-sender.provider";
import { NodemailerEmailSender } from "@/shared/email/nodemailer-email-sender.provider";
import { ResendEmailSender } from "@/shared/email/resend-email-sender.provider";

export function createEmailSender(env: IEnv): IEmailSender {
  if (env.EMAIL_PROVIDER === "resend") {
    return new ResendEmailSender({
      apiKey: env.RESEND_API_KEY!,
      from: env.SMTP_FROM,
    });
  }

  if (env.EMAIL_PROVIDER === "local") {
    return new NodemailerEmailSender({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      user: env.SMTP_USER,
      password: env.SMTP_PASSWORD,
      from: env.SMTP_FROM,
    });
  }

  throw new Error("Invalid email provider");
}
