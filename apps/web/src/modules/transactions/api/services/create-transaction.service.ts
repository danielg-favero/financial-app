import type { IHttpClient } from "@/shared/infra/http/client";
import type { IBulkCreateResponse } from "@/shared/infra/http/bulk";

import type { ITransaction } from "@/modules/transactions/types/transaction";

export interface ICreateTransactionDTO {
  categoryId: string;
  description: string | null;
  amount: number;
  referenceMonth: number;
  referenceYear: number;
  transactionDate: string;
}

export class CreateTransactionService {
  constructor(private httpClient: IHttpClient) {}

  async execute(dtos: ICreateTransactionDTO[]): Promise<IBulkCreateResponse<ITransaction>> {
    return this.httpClient.post<IBulkCreateResponse<ITransaction>, ICreateTransactionDTO[]>(
      "/transactions",
      dtos,
    );
  }
}
