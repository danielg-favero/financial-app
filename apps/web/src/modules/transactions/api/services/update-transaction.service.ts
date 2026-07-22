import type { IHttpClient } from "@/shared/infra/http/client";

import type {
  ITransaction,
  ITransactionResponse,
} from "@/modules/transactions/types/transaction";

export interface IUpdateTransactionDTO {
  categoryId?: string;
  description?: string | null;
  amount?: number;
  referenceMonth?: number;
  referenceYear?: number;
  transactionDate?: string;
}

export interface IUpdateTransactionInput {
  id: string;
  dto: IUpdateTransactionDTO;
}

export class UpdateTransactionService {
  constructor(private httpClient: IHttpClient) {}

  async execute({ id, dto }: IUpdateTransactionInput): Promise<ITransaction> {
    const response = await this.httpClient.patch<ITransactionResponse, IUpdateTransactionDTO>(
      `/transactions/${id}`,
      dto,
    );
    return response.transaction;
  }
}
