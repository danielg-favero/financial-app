export interface ISendEmailDTO {
  to: string;
  subject: string;
  html: string;
}

export interface IEmailSender {
  send(email: ISendEmailDTO): Promise<void>;
}
