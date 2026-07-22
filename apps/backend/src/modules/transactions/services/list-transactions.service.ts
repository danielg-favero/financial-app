import type { Transaction } from "@/modules/transactions/domain/entities/transaction";
import type { IListTransactionsFilterDTO } from "@/modules/transactions/dtos/list-transactions-filter.dto";
import type { ITransactionRepository } from "@/modules/transactions/repositories/transaction.repository";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

export interface IListTransactionsServiceDeps {
  transactionRepository: ITransactionRepository;
}

export class ListTransactionsService {
  private readonly transactionRepository: ITransactionRepository;

  constructor({ transactionRepository }: IListTransactionsServiceDeps) {
    this.transactionRepository = transactionRepository;
  }

  async execute(
    userId: string,
    filter: IListTransactionsFilterDTO,
  ): Promise<IFilteredResult<Transaction>> {
    return this.transactionRepository.findManyByUserId(userId, filter);
  }
}
