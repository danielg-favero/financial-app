import type { IEmailSender, ISendEmailDTO } from "@/shared/email/email-sender.provider";

export class InMemoryEmailSender implements IEmailSender {
  readonly sentEmails: ISendEmailDTO[] = [];

  async send(email: ISendEmailDTO): Promise<void> {
    this.sentEmails.push(email);
  }
}

export class FailingEmailSender implements IEmailSender {
  async send(): Promise<void> {
    throw new Error("SMTP unavailable");
  }
}
