import type { Transaction } from "@/modules/transactions/domain/entities/transaction";
import type { IListTransactionsFilterDTO } from "@/modules/transactions/dtos/list-transactions-filter.dto";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

export interface ICreateTransactionData {
  userId: string;
  categoryId: string;
  description: string | null;
  amount: number;
  referenceMonth: number;
  referenceYear: number;
  transactionDate: Date;
}

export interface IUpdateTransactionData {
  categoryId?: string;
  description?: string | null;
  amount?: number;
  referenceMonth?: number;
  referenceYear?: number;
  transactionDate?: Date;
}

export interface ITransactionRepository {
  create(data: ICreateTransactionData): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findManyByUserId(
    userId: string,
    filter: IListTransactionsFilterDTO,
  ): Promise<IFilteredResult<Transaction>>;
  update(id: string, data: IUpdateTransactionData): Promise<Transaction>;
  delete(id: string): Promise<void>;
}
