import nodemailer, { type Transporter } from "nodemailer";

import type { IEmailSender, ISendEmailDTO } from "@/shared/email/email-sender.provider";

export interface INodemailerEmailSenderDeps {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  password?: string;
  from: string;
}

export class NodemailerEmailSender implements IEmailSender {
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor({ host, port, secure, user, password, from }: INodemailerEmailSenderDeps) {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && password ? { user, pass: password } : undefined,
    });
    this.from = from;
  }

  async send(email: ISendEmailDTO): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: email.to,
      subject: email.subject,
      html: email.html,
    });
  }
}
