import {
  baseLayout,
  escapeHtml,
  type IEmailTemplate,
} from "@/shared/email/templates/base-layout";

export interface IPasswordResetConfirmationEmailData {
  firstName: string;
}

export function passwordResetConfirmationEmail({
  firstName,
}: IPasswordResetConfirmationEmailData): IEmailTemplate {
  const safeFirstName = escapeHtml(firstName);

  return {
    subject: "Your password has been changed",
    html: baseLayout({
      title: "Password changed",
      body: `
        <p style="margin: 0 0 16px; color: #374151; font-size: 14px; line-height: 1.6;">
          Hi ${safeFirstName}, your password has been changed successfully. All active sessions
          have been signed out.
        </p>
        <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">
          If you didn't make this change, please reset your password immediately.
        </p>
      `,
    }),
  };
}
