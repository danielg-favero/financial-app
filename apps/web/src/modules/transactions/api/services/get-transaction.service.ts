import type { IHttpClient } from "@/shared/infra/http/client";

import type {
  ITransaction,
  ITransactionResponse,
} from "@/modules/transactions/types/transaction";

export class GetTransactionService {
  constructor(private httpClient: IHttpClient) {}

  async execute(id: string): Promise<ITransaction> {
    const response = await this.httpClient.get<ITransactionResponse>(`/transactions/${id}`);
    return response.transaction;
  }
}
