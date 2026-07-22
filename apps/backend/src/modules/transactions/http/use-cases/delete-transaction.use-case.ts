import type { DeleteTransactionService } from "@/modules/transactions/services/delete-transaction.service";
import { AppError } from "@/shared/errors/app-error";
import type { IBulkDeleteResult } from "@/shared/http/bulk-result";

export interface IDeleteTransactionUseCaseDeps {
  deleteTransactionService: DeleteTransactionService;
}

export class DeleteTransactionUseCase {
  private readonly deleteTransactionService: DeleteTransactionService;

  constructor({ deleteTransactionService }: IDeleteTransactionUseCaseDeps) {
    this.deleteTransactionService = deleteTransactionService;
  }

  async execute(id: string, userId: string): Promise<void> {
    await this.deleteTransactionService.execute(id, userId);
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
