import { CategoryInUseError } from "@/modules/categories/domain/errors/category-in-use.error";
import type { DeleteCategoryService } from "@/modules/categories/services/delete-category.service";
import type { ListCategoriesService } from "@/modules/categories/services/list-categories.service";
import type { ListTransactionsService } from "@/modules/transactions/services/list-transactions.service";
import { AppError } from "@/shared/errors/app-error";
import type { IBulkDeleteResult } from "@/shared/http/bulk-result";

export interface IDeleteCategoryUseCaseDeps {
  deleteCategoryService: DeleteCategoryService;
  listCategoriesService: ListCategoriesService;
  /** Lazy to break the categories <-> transactions container construction cycle. */
  listTransactionsService: () => ListTransactionsService;
}

export class DeleteCategoryUseCase {
  private readonly deleteCategoryService: DeleteCategoryService;
  private readonly listCategoriesService: ListCategoriesService;
  private readonly listTransactionsService: () => ListTransactionsService;

  constructor({
    deleteCategoryService,
    listCategoriesService,
    listTransactionsService,
  }: IDeleteCategoryUseCaseDeps) {
    this.deleteCategoryService = deleteCategoryService;
    this.listCategoriesService = listCategoriesService;
    this.listTransactionsService = listTransactionsService;
  }

  async execute(id: string, userId: string): Promise<void> {
    const transactions = await this.listTransactionsService().execute(userId, {
      page: 1,
      perPage: 1,
      sort: "asc",
      filters: { categoryId: id },
    });
    if (transactions.total > 0) {
      throw new CategoryInUseError();
    }

    const children = await this.listCategoriesService.execute(userId, {
      page: 1,
      perPage: 1,
      sort: "asc",
      filters: { parentId: id },
    });
    if (children.total > 0) {
      throw new CategoryInUseError();
    }

    await this.deleteCategoryService.execute(id, userId);
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
