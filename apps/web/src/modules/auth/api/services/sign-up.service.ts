import type { IHttpClient } from "@/shared/infra/http/client";

import type { IUser } from "@/modules/auth/types/user";

export interface ISignUpDTO {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface ISignUpResponse {
  user: IUser;
  verificationToken: string;
}

export class SignUpService {
  constructor(private httpClient: IHttpClient) {}

  async execute(dto: ISignUpDTO): Promise<ISignUpResponse> {
    return this.httpClient.post<ISignUpResponse, ISignUpDTO>("/auth/signup", dto);
  }
}
