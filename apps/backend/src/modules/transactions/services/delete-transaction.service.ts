import { TransactionNotFoundError } from "@/modules/transactions/domain/errors/transaction-not-found.error";
import type { ITransactionRepository } from "@/modules/transactions/repositories/transaction.repository";

export interface IDeleteTransactionServiceDeps {
  transactionRepository: ITransactionRepository;
}

export class DeleteTransactionService {
  private readonly transactionRepository: ITransactionRepository;

  constructor({ transactionRepository }: IDeleteTransactionServiceDeps) {
    this.transactionRepository = transactionRepository;
  }

  async execute(id: string, userId: string): Promise<void> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction || transaction.userId !== userId) {
      throw new TransactionNotFoundError();
    }
    await this.transactionRepository.delete(id);
  }
}
