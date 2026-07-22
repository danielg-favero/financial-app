import type { Loan } from "@/modules/loans/domain/entities/loan";
import { LoanNotFoundError } from "@/modules/loans/domain/errors/loan-not-found.error";
import type { IUpdateLoanDTO } from "@/modules/loans/dtos/update-loan.dto";
import type { ILoanRepository } from "@/modules/loans/repositories/loan.repository";

export interface IUpdateLoanServiceDeps {
  loanRepository: ILoanRepository;
}

export class UpdateLoanService {
  private readonly loanRepository: ILoanRepository;

  constructor({ loanRepository }: IUpdateLoanServiceDeps) {
    this.loanRepository = loanRepository;
  }

  async execute(id: string, userId: string, dto: IUpdateLoanDTO): Promise<Loan> {
    const loan = await this.loanRepository.findById(id);
    if (!loan || loan.userId !== userId) {
      throw new LoanNotFoundError();
    }

    const amountLent = dto.amountLent ?? loan.amountLent;
    const amountReceived = dto.amountReceived ?? loan.amountReceived;
    const openBalance = amountLent - amountReceived;

    return this.loanRepository.update(id, {
      loanDate: dto.loanDate,
      personName: dto.personName,
      description: dto.description,
      amountLent: dto.amountLent,
      amountReceived: dto.amountReceived,
      openBalance,
      isPaid: openBalance <= 0,
    });
  }
}
