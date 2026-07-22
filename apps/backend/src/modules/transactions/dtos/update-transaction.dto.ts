export interface IUpdateTransactionDTO {
  categoryId?: string;
  description?: string | null;
  amount?: number;
  referenceMonth?: number;
  referenceYear?: number;
  transactionDate?: Date;
}
