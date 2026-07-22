import type { CategoryType, ExpenseKind } from "@/modules/categories/domain/entities/category";
import type { IFilter } from "@/shared/filters/filter";

export const transactionOrderByFields = [
  "description",
  "amount",
  "transactionDate",
  "referenceMonth",
  "referenceYear",
] as const;

export type TransactionOrderByField = (typeof transactionOrderByFields)[number];

export interface ITransactionFiltersDTO {
  categoryId?: string;
  referenceMonth?: number;
  referenceYear?: number;
  categoryType?: CategoryType;
  expenseKind?: ExpenseKind;
}

export type IListTransactionsFilterDTO = IFilter<TransactionOrderByField, ITransactionFiltersDTO>;
