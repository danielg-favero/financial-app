import type { CategoryType, ExpenseKind } from "@/modules/categories/types/category";

export interface ITransactionCategory {
  id: string;
  name: string;
  type: CategoryType;
  expenseKind: ExpenseKind | null;
}

export interface ITransaction {
  id: string;
  categoryId: string;
  description: string | null;
  amount: number;
  referenceMonth: number;
  referenceYear: number;
  transactionDate: string;
  category: ITransactionCategory;
  createdAt: string;
  updatedAt: string;
}

export interface ITransactionResponse {
  transaction: ITransaction;
}

export const transactionOrderByFields = [
  "description",
  "amount",
  "transactionDate",
  "referenceMonth",
  "referenceYear",
] as const;

export type TransactionOrderByField = (typeof transactionOrderByFields)[number];

export interface ITransactionFilters {
  categoryId?: string;
  referenceMonth?: number;
  referenceYear?: number;
  categoryType?: CategoryType;
  expenseKind?: ExpenseKind;
}

/** pt-BR month names indexed by `referenceMonth` (1-12). */
export const MONTH_LABELS: Record<number, string> = {
  1: "Janeiro",
  2: "Fevereiro",
  3: "Março",
  4: "Abril",
  5: "Maio",
  6: "Junho",
  7: "Julho",
  8: "Agosto",
  9: "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
};
