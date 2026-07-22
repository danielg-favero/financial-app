import { CategoryNotFoundError } from "@/modules/categories/domain/errors/category-not-found.error";
import type { GetCategoryService } from "@/modules/categories/services/get-category.service";
import type { Transaction } from "@/modules/transactions/domain/entities/transaction";
import { InvalidTransactionCategoryError } from "@/modules/transactions/domain/errors/invalid-transaction-category.error";
import type { IUpdateTransactionDTO } from "@/modules/transactions/dtos/update-transaction.dto";
import type { UpdateTransactionService } from "@/modules/transactions/services/update-transaction.service";

export interface IUpdateTransactionUseCaseDeps {
  updateTransactionService: UpdateTransactionService;
  getCategoryService: GetCategoryService;
}

export class UpdateTransactionUseCase {
  private readonly updateTransactionService: UpdateTransactionService;
  private readonly getCategoryService: GetCategoryService;

  constructor({
    updateTransactionService,
    getCategoryService,
  }: IUpdateTransactionUseCaseDeps) {
    this.updateTransactionService = updateTransactionService;
    this.getCategoryService = getCategoryService;
  }

  async execute(id: string, userId: string, dto: IUpdateTransactionDTO): Promise<Transaction> {
    if (dto.categoryId) {
      try {
        await this.getCategoryService.execute(dto.categoryId, userId);
      } catch (error) {
        if (error instanceof CategoryNotFoundError) {
          throw new InvalidTransactionCategoryError();
        }
        throw error;
      }
    }

    return this.updateTransactionService.execute(id, userId, dto);
  }
}
