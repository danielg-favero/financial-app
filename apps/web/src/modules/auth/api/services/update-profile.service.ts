import type { IHttpClient } from "@/shared/infra/http/client";

import type { IUser, IUserResponse } from "@/modules/auth/types/user";

export interface IUpdateProfileDTO {
  firstName: string;
  lastName: string;
  email: string;
}

export class UpdateProfileService {
  constructor(private httpClient: IHttpClient) {}

  async execute(dto: IUpdateProfileDTO): Promise<IUser> {
    const response = await this.httpClient.patch<IUserResponse, IUpdateProfileDTO>(
      "/auth/me",
      dto,
    );
    return response.user;
  }
}
