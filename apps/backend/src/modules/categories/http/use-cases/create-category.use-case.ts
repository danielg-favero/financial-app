import type { Category } from "@/modules/categories/domain/entities/category";
import { CategoryNotFoundError } from "@/modules/categories/domain/errors/category-not-found.error";
import { ParentCategoryNotFoundError } from "@/modules/categories/domain/errors/parent-category-not-found.error";
import type { ICreateCategoryDTO } from "@/modules/categories/dtos/create-category.dto";
import type { CreateCategoryService } from "@/modules/categories/services/create-category.service";
import type { GetCategoryService } from "@/modules/categories/services/get-category.service";
import { AppError } from "@/shared/errors/app-error";
import type { IBulkCreateResult } from "@/shared/http/bulk-result";

export interface ICreateCategoryUseCaseDeps {
  createCategoryService: CreateCategoryService;
  getCategoryService: GetCategoryService;
}

export class CreateCategoryUseCase {
  private readonly createCategoryService: CreateCategoryService;
  private readonly getCategoryService: GetCategoryService;

  constructor({
    createCategoryService,
    getCategoryService,
  }: ICreateCategoryUseCaseDeps) {
    this.createCategoryService = createCategoryService;
    this.getCategoryService = getCategoryService;
  }

  async execute(dto: ICreateCategoryDTO): Promise<Category> {
    if (dto.parentId) {
      try {
        await this.getCategoryService.execute(dto.parentId, dto.userId);
      } catch (error) {
        if (error instanceof CategoryNotFoundError) {
          throw new ParentCategoryNotFoundError();
        }
        throw error;
      }
    }

    return this.createCategoryService.execute(dto);
  }

  async executeMany(dtos: ICreateCategoryDTO[]): Promise<IBulkCreateResult<Category>> {
    const created: Category[] = [];
    const failed: IBulkCreateResult<Category>["failed"] = [];

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
