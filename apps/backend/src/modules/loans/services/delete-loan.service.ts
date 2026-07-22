import { LoanNotFoundError } from "@/modules/loans/domain/errors/loan-not-found.error";
import type { ILoanRepository } from "@/modules/loans/repositories/loan.repository";

export interface IDeleteLoanServiceDeps {
  loanRepository: ILoanRepository;
}

export class DeleteLoanService {
  private readonly loanRepository: ILoanRepository;

  constructor({ loanRepository }: IDeleteLoanServiceDeps) {
    this.loanRepository = loanRepository;
  }

  async execute(id: string, userId: string): Promise<void> {
    const loan = await this.loanRepository.findById(id);
    if (!loan || loan.userId !== userId) {
      throw new LoanNotFoundError();
    }
    await this.loanRepository.delete(id);
  }
}
