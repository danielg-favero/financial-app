import type { Category } from "@/modules/categories/domain/entities/category";
import type { IListCategoriesFilterDTO } from "@/modules/categories/dtos/list-categories-filter.dto";
import type { ListCategoriesService } from "@/modules/categories/services/list-categories.service";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

export interface IListCategoriesUseCaseDeps {
  listCategoriesService: ListCategoriesService;
}

export class ListCategoriesUseCase {
  private readonly listCategoriesService: ListCategoriesService;

  constructor({ listCategoriesService }: IListCategoriesUseCaseDeps) {
    this.listCategoriesService = listCategoriesService;
  }

  async execute(
    userId: string,
    filter: IListCategoriesFilterDTO,
  ): Promise<IFilteredResult<Category>> {
    return this.listCategoriesService.execute(userId, filter);
  }
}
