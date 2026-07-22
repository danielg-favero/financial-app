import type { IHttpClient } from "@/shared/infra/http/client";

export class DeleteAccountService {
  constructor(private httpClient: IHttpClient) {}

  async execute(): Promise<void> {
    await this.httpClient.delete<void>("/auth/me");
  }
}
