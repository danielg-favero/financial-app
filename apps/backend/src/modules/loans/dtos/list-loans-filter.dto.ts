import type { IFilter } from "@/shared/filters/filter";

export const loanOrderByFields = [
  "personName",
  "loanDate",
  "amountLent",
  "openBalance",
  "isPaid",
] as const;

export type LoanOrderByField = (typeof loanOrderByFields)[number];

export type IListLoansFilterDTO = IFilter<LoanOrderByField>;
