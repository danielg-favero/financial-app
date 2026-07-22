import type { Transaction } from "@/modules/transactions/domain/entities/transaction";
import { TransactionNotFoundError } from "@/modules/transactions/domain/errors/transaction-not-found.error";
import type { ITransactionRepository } from "@/modules/transactions/repositories/transaction.repository";

export interface IGetTransactionServiceDeps {
  transactionRepository: ITransactionRepository;
}

export class GetTransactionService {
  private readonly transactionRepository: ITransactionRepository;

  constructor({ transactionRepository }: IGetTransactionServiceDeps) {
    this.transactionRepository = transactionRepository;
  }

  async execute(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction || transaction.userId !== userId) {
      throw new TransactionNotFoundError();
    }
    return transaction;
  }
}
