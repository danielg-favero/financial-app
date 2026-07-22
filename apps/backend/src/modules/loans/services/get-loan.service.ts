import type { Loan } from "@/modules/loans/domain/entities/loan";
import { LoanNotFoundError } from "@/modules/loans/domain/errors/loan-not-found.error";
import type { ILoanRepository } from "@/modules/loans/repositories/loan.repository";

export interface IGetLoanServiceDeps {
  loanRepository: ILoanRepository;
}

export class GetLoanService {
  private readonly loanRepository: ILoanRepository;

  constructor({ loanRepository }: IGetLoanServiceDeps) {
    this.loanRepository = loanRepository;
  }

  async execute(id: string, userId: string): Promise<Loan> {
    const loan = await this.loanRepository.findById(id);
    if (!loan || loan.userId !== userId) {
      throw new LoanNotFoundError();
    }
    return loan;
  }
}
