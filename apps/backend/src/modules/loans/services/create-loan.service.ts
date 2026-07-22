import type { Loan } from "@/modules/loans/domain/entities/loan";
import type { ICreateLoanDTO } from "@/modules/loans/dtos/create-loan.dto";
import type { ILoanRepository } from "@/modules/loans/repositories/loan.repository";

export interface ICreateLoanServiceDeps {
  loanRepository: ILoanRepository;
}

export class CreateLoanService {
  private readonly loanRepository: ILoanRepository;

  constructor({ loanRepository }: ICreateLoanServiceDeps) {
    this.loanRepository = loanRepository;
  }

  async execute(dto: ICreateLoanDTO): Promise<Loan> {
    const amountReceived = dto.amountReceived ?? 0;
    const openBalance = dto.amountLent - amountReceived;

    return this.loanRepository.create({
      userId: dto.userId,
      loanDate: dto.loanDate,
      personName: dto.personName,
      description: dto.description,
      amountLent: dto.amountLent,
      amountReceived,
      openBalance,
      isPaid: openBalance <= 0,
    });
  }
}
