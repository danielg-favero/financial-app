export interface ICreateTransactionDTO {
  userId: string;
  categoryId: string;
  description: string | null;
  amount: number;
  referenceMonth: number;
  referenceYear: number;
  transactionDate: Date;
}
