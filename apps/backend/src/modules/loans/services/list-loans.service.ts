import type { Loan } from "@/modules/loans/domain/entities/loan";
import type { IListLoansFilterDTO } from "@/modules/loans/dtos/list-loans-filter.dto";
import type { ILoanRepository } from "@/modules/loans/repositories/loan.repository";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

export interface IListLoansServiceDeps {
  loanRepository: ILoanRepository;
}

export class ListLoansService {
  private readonly loanRepository: ILoanRepository;

  constructor({ loanRepository }: IListLoansServiceDeps) {
    this.loanRepository = loanRepository;
  }

  async execute(userId: string, filter: IListLoansFilterDTO): Promise<IFilteredResult<Loan>> {
    return this.loanRepository.findManyByUserId(userId, filter);
  }
}
