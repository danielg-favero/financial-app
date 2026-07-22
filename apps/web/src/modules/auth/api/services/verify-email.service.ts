import type { IHttpClient } from "@/shared/infra/http/client";

import type { IUser, IUserResponse } from "@/modules/auth/types/user";

export interface IVerifyEmailDTO {
  token: string;
}

export class VerifyEmailService {
  constructor(private httpClient: IHttpClient) {}

  async execute(dto: IVerifyEmailDTO): Promise<IUser> {
    const response = await this.httpClient.post<IUserResponse, IVerifyEmailDTO>(
      "/auth/verify-email",
      dto,
    );
    return response.user;
  }
}
