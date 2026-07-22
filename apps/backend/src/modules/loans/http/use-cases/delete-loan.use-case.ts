import type { DeleteLoanService } from "@/modules/loans/services/delete-loan.service";
import { AppError } from "@/shared/errors/app-error";
import type { IBulkDeleteResult } from "@/shared/http/bulk-result";

export interface IDeleteLoanUseCaseDeps {
  deleteLoanService: DeleteLoanService;
}

export class DeleteLoanUseCase {
  private readonly deleteLoanService: DeleteLoanService;

  constructor({ deleteLoanService }: IDeleteLoanUseCaseDeps) {
    this.deleteLoanService = deleteLoanService;
  }

  async execute(id: string, userId: string): Promise<void> {
    await this.deleteLoanService.execute(id, userId);
  }

  async executeMany(ids: string[], userId: string): Promise<IBulkDeleteResult> {
    const deleted: string[] = [];
    const failed: IBulkDeleteResult["failed"] = [];

    for (const id of ids) {
      try {
        await this.execute(id, userId);
        deleted.push(id);
      } catch (error) {
        if (error instanceof AppError) {
          failed.push({ id, error: error.message });
          continue;
        }
        throw error;
      }
    }

    return { deleted, failed };
  }
}
