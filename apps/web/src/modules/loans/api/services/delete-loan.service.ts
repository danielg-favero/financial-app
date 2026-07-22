import type { IHttpClient } from "@/shared/infra/http/client";
import type { IBulkDeleteResponse } from "@/shared/infra/http/bulk";

export class DeleteLoanService {
  constructor(private httpClient: IHttpClient) {}

  async execute(ids: string[]): Promise<IBulkDeleteResponse> {
    return this.httpClient.delete<IBulkDeleteResponse>("/loans", { data: { ids } });
  }
}
