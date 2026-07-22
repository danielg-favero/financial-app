import type {
  ITransactionCategory,
  Transaction,
} from "@/modules/transactions/domain/entities/transaction";

export interface ITransactionResponse {
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

export function presentTransaction(transaction: Transaction): ITransactionResponse {
  return {
    id: transaction.id,
    categoryId: transaction.categoryId,
    description: transaction.description,
    amount: transaction.amount,
    referenceMonth: transaction.referenceMonth,
    referenceYear: transaction.referenceYear,
    transactionDate: transaction.transactionDate.toISOString().slice(0, 10),
    category: transaction.category,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}
