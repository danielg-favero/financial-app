import type { Loan } from "@/modules/loans/domain/entities/loan";
import type { IUpdateLoanDTO } from "@/modules/loans/dtos/update-loan.dto";
import type { UpdateLoanService } from "@/modules/loans/services/update-loan.service";

export interface IUpdateLoanUseCaseDeps {
  updateLoanService: UpdateLoanService;
}

export class UpdateLoanUseCase {
  private readonly updateLoanService: UpdateLoanService;

  constructor({ updateLoanService }: IUpdateLoanUseCaseDeps) {
    this.updateLoanService = updateLoanService;
  }

  async execute(id: string, userId: string, dto: IUpdateLoanDTO): Promise<Loan> {
    return this.updateLoanService.execute(id, userId, dto);
  }
}
