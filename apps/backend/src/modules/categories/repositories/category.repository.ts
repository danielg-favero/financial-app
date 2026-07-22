import type { Category, CategoryType, ExpenseKind } from "@/modules/categories/domain/entities/category";
import type { IListCategoriesFilterDTO } from "@/modules/categories/dtos/list-categories-filter.dto";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

export interface ICreateCategoryData {
  userId: string;
  name: string;
  type: CategoryType;
  expenseKind: ExpenseKind | null;
  parentId: string | null;
}

export interface IUpdateCategoryData {
  name?: string;
  type?: CategoryType;
  expenseKind?: ExpenseKind | null;
  parentId?: string | null;
}

export interface ICategoryRepository {
  create(data: ICreateCategoryData): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findManyByUserId(userId: string, filter: IListCategoriesFilterDTO): Promise<IFilteredResult<Category>>;
  update(id: string, data: IUpdateCategoryData): Promise<Category>;
  delete(id: string): Promise<void>;
}
