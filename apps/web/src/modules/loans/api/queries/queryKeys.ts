import type { IListLoansParams } from "@/modules/loans/api/services/list-loans.service";

export const loanQueryKeys = {
  root: ["loans"] as const,
  list: (params: IListLoansParams) => ["loans", "list", params] as const,
  detail: (id: string) => ["loans", "detail", id] as const,
};
