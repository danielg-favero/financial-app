import { CategoryNotFoundError } from "@/modules/categories/domain/errors/category-not-found.error";
import type { GetCategoryService } from "@/modules/categories/services/get-category.service";
import type { Transaction } from "@/modules/transactions/domain/entities/transaction";
import { InvalidTransactionCategoryError } from "@/modules/transactions/domain/errors/invalid-transaction-category.error";
import type { ICreateTransactionDTO } from "@/modules/transactions/dtos/create-transaction.dto";
import type { CreateTransactionService } from "@/modules/transactions/services/create-transaction.service";
import { AppError } from "@/shared/errors/app-error";
import type { IBulkCreateResult } from "@/shared/http/bulk-result";

export interface ICreateTransactionUseCaseDeps {
  createTransactionService: CreateTransactionService;
  getCategoryService: GetCategoryService;
}

export class CreateTransactionUseCase {
  private readonly createTransactionService: CreateTransactionService;
  private readonly getCategoryService: GetCategoryService;

  constructor({
    createTransactionService,
    getCategoryService,
  }: ICreateTransactionUseCaseDeps) {
    this.createTransactionService = createTransactionService;
    this.getCategoryService = getCategoryService;
  }

  async execute(dto: ICreateTransactionDTO): Promise<Transaction> {
    try {
      await this.getCategoryService.execute(dto.categoryId, dto.userId);
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        throw new InvalidTransactionCategoryError();
      }
      throw error;
    }

    return this.createTransactionService.execute(dto);
  }

  async executeMany(dtos: ICreateTransactionDTO[]): Promise<IBulkCreateResult<Transaction>> {
    const created: Transaction[] = [];
    const failed: IBulkCreateResult<Transaction>["failed"] = [];

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
