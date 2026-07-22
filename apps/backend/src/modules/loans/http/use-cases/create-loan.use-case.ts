import type { Loan } from "@/modules/loans/domain/entities/loan";
import type { ICreateLoanDTO } from "@/modules/loans/dtos/create-loan.dto";
import type { CreateLoanService } from "@/modules/loans/services/create-loan.service";
import { AppError } from "@/shared/errors/app-error";
import type { IBulkCreateResult } from "@/shared/http/bulk-result";

export interface ICreateLoanUseCaseDeps {
  createLoanService: CreateLoanService;
}

export class CreateLoanUseCase {
  private readonly createLoanService: CreateLoanService;

  constructor({ createLoanService }: ICreateLoanUseCaseDeps) {
    this.createLoanService = createLoanService;
  }

  async execute(dto: ICreateLoanDTO): Promise<Loan> {
    return this.createLoanService.execute(dto);
  }

  async executeMany(dtos: ICreateLoanDTO[]): Promise<IBulkCreateResult<Loan>> {
    const created: Loan[] = [];
    const failed: IBulkCreateResult<Loan>["failed"] = [];

    for (const [index, dto] of dtos.entries()) {
      try {
        created.push(await this.execute(dto));
      } catch (error) {
        if (error instanceof AppError) {
          failed.push({ index, error: error.message });
          continue;
        }
        throw error;
      }
    }

    return { created, failed };
  }
}
