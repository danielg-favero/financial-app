import type { IHttpClient } from "@/shared/infra/http/client";

export interface IResetPasswordDTO {
  token: string;
  password: string;
  confirmPassword: string;
}

export class ResetPasswordService {
  constructor(private httpClient: IHttpClient) {}

  async execute(dto: IResetPasswordDTO): Promise<void> {
    await this.httpClient.post<void, IResetPasswordDTO>("/auth/reset-password", dto);
  }
}
