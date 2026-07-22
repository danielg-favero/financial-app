import type { Category } from "@/modules/categories/domain/entities/category";
import type { IListCategoriesFilterDTO } from "@/modules/categories/dtos/list-categories-filter.dto";
import type { ICategoryRepository } from "@/modules/categories/repositories/category.repository";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

export interface IListCategoriesServiceDeps {
  categoryRepository: ICategoryRepository;
}

export class ListCategoriesService {
  private readonly categoryRepository: ICategoryRepository;

  constructor({ categoryRepository }: IListCategoriesServiceDeps) {
    this.categoryRepository = categoryRepository;
  }

  async execute(
    userId: string,
    filter: IListCategoriesFilterDTO,
  ): Promise<IFilteredResult<Category>> {
    return this.categoryRepository.findManyByUserId(userId, filter);
  }
}
