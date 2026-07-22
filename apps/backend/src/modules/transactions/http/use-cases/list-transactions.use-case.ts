import type { Transaction } from "@/modules/transactions/domain/entities/transaction";
import type { IListTransactionsFilterDTO } from "@/modules/transactions/dtos/list-transactions-filter.dto";
import type { ListTransactionsService } from "@/modules/transactions/services/list-transactions.service";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

export interface IListTransactionsUseCaseDeps {
  listTransactionsService: ListTransactionsService;
}

export class ListTransactionsUseCase {
  private readonly listTransactionsService: ListTransactionsService;

  constructor({ listTransactionsService }: IListTransactionsUseCaseDeps) {
    this.listTransactionsService = listTransactionsService;
  }

  async execute(
    userId: string,
    filter: IListTransactionsFilterDTO,
  ): Promise<IFilteredResult<Transaction>> {
    return this.listTransactionsService.execute(userId, filter);
  }
}
