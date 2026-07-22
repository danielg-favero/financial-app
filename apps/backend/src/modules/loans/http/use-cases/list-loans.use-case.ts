import type { Loan } from "@/modules/loans/domain/entities/loan";
import type { IListLoansFilterDTO } from "@/modules/loans/dtos/list-loans-filter.dto";
import type { ListLoansService } from "@/modules/loans/services/list-loans.service";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

export interface IListLoansUseCaseDeps {
  listLoansService: ListLoansService;
}

export class ListLoansUseCase {
  private readonly listLoansService: ListLoansService;

  constructor({ listLoansService }: IListLoansUseCaseDeps) {
    this.listLoansService = listLoansService;
  }

  async execute(userId: string, filter: IListLoansFilterDTO): Promise<IFilteredResult<Loan>> {
    return this.listLoansService.execute(userId, filter);
  }
}
