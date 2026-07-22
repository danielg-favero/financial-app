import type { IHttpClient } from "@/shared/infra/http/client";

import type { IUser, IUserResponse } from "@/modules/auth/types/user";

export class GetMeService {
  constructor(private httpClient: IHttpClient) {}

  async execute(): Promise<IUser> {
    const response = await this.httpClient.get<IUserResponse>("/auth/me");
    return response.user;
  }
}
