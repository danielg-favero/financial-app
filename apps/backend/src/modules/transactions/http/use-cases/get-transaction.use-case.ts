import type { Transaction } from "@/modules/transactions/domain/entities/transaction";
import type { GetTransactionService } from "@/modules/transactions/services/get-transaction.service";

export interface IGetTransactionUseCaseDeps {
  getTransactionService: GetTransactionService;
}

export class GetTransactionUseCase {
  private readonly getTransactionService: GetTransactionService;

  constructor({ getTransactionService }: IGetTransactionUseCaseDeps) {
    this.getTransactionService = getTransactionService;
  }

  async execute(id: string, userId: string): Promise<Transaction> {
    return this.getTransactionService.execute(id, userId);
  }
}
