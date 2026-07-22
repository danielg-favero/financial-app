import type { IHttpClient } from "@/shared/infra/http/client";

export interface IForgotPasswordDTO {
  email: string;
}

export class ForgotPasswordService {
  constructor(private httpClient: IHttpClient) {}

  async execute(dto: IForgotPasswordDTO): Promise<void> {
    await this.httpClient.post<void, IForgotPasswordDTO>("/auth/forgot-password", dto);
  }
}
