import {
  baseLayout,
  escapeHtml,
  type IEmailTemplate,
} from "@/shared/email/templates/base-layout";

export interface IRegisterConfirmationEmailData {
  firstName: string;
  verificationUrl: string;
}

export function registerConfirmationEmail({
  firstName,
  verificationUrl,
}: IRegisterConfirmationEmailData): IEmailTemplate {
  const safeFirstName = escapeHtml(firstName);
  const safeVerificationUrl = escapeHtml(verificationUrl);

  return {
    subject: "Confirm your registration",
    html: baseLayout({
      title: "Welcome to Financial App!",
      body: `
        <p style="margin: 0 0 16px; color: #374151; font-size: 14px; line-height: 1.6;">
          Hi ${safeFirstName}, your account was created successfully. Please confirm your email
          address to activate your account.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 0 16px;">
          <tr>
            <td style="background-color: #2563eb; border-radius: 6px;">
              <a href="${safeVerificationUrl}" style="display: inline-block; padding: 12px 24px; color: #ffffff; font-size: 14px; font-weight: bold; text-decoration: none;">
                Verify my email
              </a>
            </td>
          </tr>
        </table>
        <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br />
          <a href="${safeVerificationUrl}" style="color: #2563eb; word-break: break-all;">${safeVerificationUrl}</a>
        </p>
      `,
    }),
  };
}
