import type { IHttpClient } from "@/shared/infra/http/client";
import {
  buildListQueryParams,
  type IListParams,
  type IListResponse,
} from "@/shared/infra/http/list";

import type {
  ITransaction,
  ITransactionFilters,
  TransactionOrderByField,
} from "@/modules/transactions/types/transaction";

export type IListTransactionsParams = IListParams<TransactionOrderByField, ITransactionFilters>;

export class ListTransactionsService {
  constructor(private httpClient: IHttpClient) {}

  async execute(params: IListTransactionsParams): Promise<IListResponse<ITransaction>> {
    return this.httpClient.get<IListResponse<ITransaction>>("/transactions", {
      params: buildListQueryParams(params),
    });
  }
}
