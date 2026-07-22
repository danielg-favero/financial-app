import { CategoryNotFoundError } from "@/modules/categories/domain/errors/category-not-found.error";
import type { ICategoryRepository } from "@/modules/categories/repositories/category.repository";

export interface IDeleteCategoryServiceDeps {
  categoryRepository: ICategoryRepository;
}

export class DeleteCategoryService {
  private readonly categoryRepository: ICategoryRepository;

  constructor({ categoryRepository }: IDeleteCategoryServiceDeps) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id: string, userId: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category || category.userId !== userId) {
      throw new CategoryNotFoundError();
    }
    await this.categoryRepository.delete(id);
  }
}
