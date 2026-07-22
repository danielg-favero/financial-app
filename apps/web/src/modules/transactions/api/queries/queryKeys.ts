import type { IListTransactionsParams } from "@/modules/transactions/api/services/list-transactions.service";

export const transactionQueryKeys = {
  root: ["transactions"] as const,
  list: (params: IListTransactionsParams) => ["transactions", "list", params] as const,
  detail: (id: string) => ["transactions", "detail", id] as const,
};
