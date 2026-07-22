import type { Transaction } from "@/modules/transactions/domain/entities/transaction";
import { TransactionNotFoundError } from "@/modules/transactions/domain/errors/transaction-not-found.error";
import type { IUpdateTransactionDTO } from "@/modules/transactions/dtos/update-transaction.dto";
import type { ITransactionRepository } from "@/modules/transactions/repositories/transaction.repository";

export interface IUpdateTransactionServiceDeps {
  transactionRepository: ITransactionRepository;
}

export class UpdateTransactionService {
  private readonly transactionRepository: ITransactionRepository;

  constructor({ transactionRepository }: IUpdateTransactionServiceDeps) {
    this.transactionRepository = transactionRepository;
  }

  async execute(id: string, userId: string, dto: IUpdateTransactionDTO): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction || transaction.userId !== userId) {
      throw new TransactionNotFoundError();
    }
    return this.transactionRepository.update(id, dto);
  }
}
