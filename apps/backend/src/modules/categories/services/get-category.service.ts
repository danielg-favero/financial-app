import type { Category } from "@/modules/categories/domain/entities/category";
import { CategoryNotFoundError } from "@/modules/categories/domain/errors/category-not-found.error";
import type { ICategoryRepository } from "@/modules/categories/repositories/category.repository";

export interface IGetCategoryServiceDeps {
  categoryRepository: ICategoryRepository;
}

export class GetCategoryService {
  private readonly categoryRepository: ICategoryRepository;

  constructor({ categoryRepository }: IGetCategoryServiceDeps) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id: string, userId: string): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category || category.userId !== userId) {
      throw new CategoryNotFoundError();
    }
    return category;
  }
}
