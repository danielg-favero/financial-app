import type { Loan } from "@/modules/loans/domain/entities/loan";
import type { GetLoanService } from "@/modules/loans/services/get-loan.service";

export interface IGetLoanUseCaseDeps {
  getLoanService: GetLoanService;
}

export class GetLoanUseCase {
  private readonly getLoanService: GetLoanService;

  constructor({ getLoanService }: IGetLoanUseCaseDeps) {
    this.getLoanService = getLoanService;
  }

  async execute(id: string, userId: string): Promise<Loan> {
    return this.getLoanService.execute(id, userId);
  }
}
