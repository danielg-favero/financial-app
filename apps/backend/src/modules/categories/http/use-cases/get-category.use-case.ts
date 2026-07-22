import type { Category } from "@/modules/categories/domain/entities/category";
import type { GetCategoryService } from "@/modules/categories/services/get-category.service";

export interface IGetCategoryUseCaseDeps {
  getCategoryService: GetCategoryService;
}

export class GetCategoryUseCase {
  private readonly getCategoryService: GetCategoryService;

  constructor({ getCategoryService }: IGetCategoryUseCaseDeps) {
    this.getCategoryService = getCategoryService;
  }

  async execute(id: string, userId: string): Promise<Category> {
    return this.getCategoryService.execute(id, userId);
  }
}
