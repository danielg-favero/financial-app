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
    await this.client.emails.send({
      from: this.from,
      to: email.to,
      subject: email.subject,
      html: email.html,
    });
  }
}
