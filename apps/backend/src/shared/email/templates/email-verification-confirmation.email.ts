import {
  baseLayout,
  escapeHtml,
  type IEmailTemplate,
} from "@/shared/email/templates/base-layout";

export interface IEmailVerificationConfirmationEmailData {
  firstName: string;
}

export function emailVerificationConfirmationEmail({
  firstName,
}: IEmailVerificationConfirmationEmailData): IEmailTemplate {
  const safeFirstName = escapeHtml(firstName);

  return {
    subject: "Your email has been verified",
    html: baseLayout({
      title: "Email verified",
      body: `
        <p style="margin: 0 0 16px; color: #374151; font-size: 14px; line-height: 1.6;">
          Hi ${safeFirstName}, your email address has been verified successfully.
        </p>
        <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">
          Your account is now active and you can sign in to Financial App.
        </p>
      `,
    }),
  };
}
