import {
  baseLayout,
  escapeHtml,
  type IEmailTemplate,
} from "@/shared/email/templates/base-layout";

export interface IPasswordResetEmailData {
  firstName: string;
  resetUrl: string;
}

export function passwordResetEmail({
  firstName,
  resetUrl,
}: IPasswordResetEmailData): IEmailTemplate {
  const safeFirstName = escapeHtml(firstName);
  const safeResetUrl = escapeHtml(resetUrl);

  return {
    subject: "Reset your password",
    html: baseLayout({
      title: "Password reset",
      body: `
        <p style="margin: 0 0 16px; color: #374151; font-size: 14px; line-height: 1.6;">
          Hi ${safeFirstName}, we received a request to reset your password. Click the button
          below to choose a new one. This link expires in 1 hour.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 16px;">
          <tr>
            <td style="background-color: #2563eb; border-radius: 6px;">
              <a href="${safeResetUrl}" style="display: inline-block; padding: 12px 24px; color: #ffffff; font-size: 14px; font-weight: bold; text-decoration: none;">
                Reset my password
              </a>
            </td>
          </tr>
        </table>
        <p style="margin: 0 0 16px; color: #6b7280; font-size: 12px; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br />
          <a href="${safeResetUrl}" style="color: #2563eb; word-break: break-all;">${safeResetUrl}</a>
        </p>
        <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.6;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      `,
    }),
  };
}
