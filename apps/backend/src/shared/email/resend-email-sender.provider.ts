import { Resend } from "resend";

import type {
  IEmailSender,
  ISendEmailDTO,
} from "@/shared/email/email-sender.provider";

export interface IResendEmailSenderDeps {
  apiKey: string;
  from: string;
}

export class ResendEmailSender implements IEmailSender {
  private readonly client: Resend;
  private readonly from: string;

  constructor({ apiKey, from }: IResendEmailSenderDeps) {
    this.client = new Resend(apiKey);
    this.from = from;
  }

  async send(email: ISendEmailDTO): Promise<void> {
    const { data, error } = await this.client.emails.send({
      from: this.from,
      to: email.to,
      subject: email.subject,
      html: email.html,
    });

    if (error) {
      console.error("Error sending email:", JSON.stringify(error));
    }

    if (data) {
      console.log("Successfully sent email");
    }
  }
}
