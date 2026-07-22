import type { Category } from "@/modules/categories/domain/entities/category";
import { CategoryNotFoundError } from "@/modules/categories/domain/errors/category-not-found.error";
import { InvalidParentCategoryError } from "@/modules/categories/domain/errors/invalid-parent-category.error";
import { ParentCategoryNotFoundError } from "@/modules/categories/domain/errors/parent-category-not-found.error";
import type { IUpdateCategoryDTO } from "@/modules/categories/dtos/update-category.dto";
import type { GetCategoryService } from "@/modules/categories/services/get-category.service";
import type { UpdateCategoryService } from "@/modules/categories/services/update-category.service";

export interface IUpdateCategoryUseCaseDeps {
  updateCategoryService: UpdateCategoryService;
  getCategoryService: GetCategoryService;
}

export class UpdateCategoryUseCase {
  private readonly updateCategoryService: UpdateCategoryService;
  private readonly getCategoryService: GetCategoryService;

  constructor({
    updateCategoryService,
    getCategoryService,
  }: IUpdateCategoryUseCaseDeps) {
    this.updateCategoryService = updateCategoryService;
    this.getCategoryService = getCategoryService;
  }

  async execute(id: string, userId: string, dto: IUpdateCategoryDTO): Promise<Category> {
    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new InvalidParentCategoryError();
      }
      try {
        await this.getCategoryService.execute(dto.parentId, userId);
      } catch (error) {
        if (error instanceof CategoryNotFoundError) {
          throw new ParentCategoryNotFoundError();
        }
        throw error;
      }
    }

    return this.updateCategoryService.execute(id, userId, dto);
  }
}
