import type { IHttpClient } from "@/shared/infra/http/client";

import type { IUser, IUserResponse } from "@/modules/auth/types/user";

export interface ISignInDTO {
  email: string;
  password: string;
}

export class SignInService {
  constructor(private httpClient: IHttpClient) {}

  async execute(dto: ISignInDTO): Promise<IUser> {
    const response = await this.httpClient.post<IUserResponse, ISignInDTO>("/auth/signin", dto);
    return response.user;
  }
}
