import type { Transaction } from "@/modules/transactions/domain/entities/transaction";
import type { ICreateTransactionDTO } from "@/modules/transactions/dtos/create-transaction.dto";
import type { ITransactionRepository } from "@/modules/transactions/repositories/transaction.repository";

export interface ICreateTransactionServiceDeps {
  transactionRepository: ITransactionRepository;
}

export class CreateTransactionService {
  private readonly transactionRepository: ITransactionRepository;

  constructor({ transactionRepository }: ICreateTransactionServiceDeps) {
    this.transactionRepository = transactionRepository;
  }

  async execute(dto: ICreateTransactionDTO): Promise<Transaction> {
    return this.transactionRepository.create(dto);
  }
}
