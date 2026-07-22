export interface IEmailTemplate {
  subject: string;
  html: string;
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export interface IBaseLayoutData {
  title: string;
  body: string;
}

export function baseLayout({ title, body }: IBaseLayoutData): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f5f7; padding: 24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="background-color: #1f2937; padding: 20px 32px;">
                <span style="color: #ffffff; font-size: 18px; font-weight: bold;">Financial App</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px;">
                <h1 style="margin: 0 0 16px; color: #111827; font-size: 20px;">${title}</h1>
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding: 16px 32px; background-color: #f9fafb;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  You are receiving this email because of your Financial App account. If this wasn't you, you can safely ignore it.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
