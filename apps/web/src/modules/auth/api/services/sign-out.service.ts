import type { IHttpClient } from "@/shared/infra/http/client";

export class SignOutService {
  constructor(private httpClient: IHttpClient) {}

  async execute(): Promise<void> {
    await this.httpClient.post<void>("/auth/signout");
  }
}
