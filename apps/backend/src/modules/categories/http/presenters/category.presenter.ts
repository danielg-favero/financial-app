import type {
  Category,
  CategoryType,
  ExpenseKind,
} from "@/modules/categories/domain/entities/category";

export interface ICategoryResponse {
  id: string;
  parentId: string | null;
  name: string;
  type: CategoryType;
  expenseKind: ExpenseKind | null;
  createdAt: string;
  updatedAt: string;
}

export function presentCategory(category: Category): ICategoryResponse {
  return {
    id: category.id,
    parentId: category.parentId,
    name: category.name,
    type: category.type,
    expenseKind: category.expenseKind,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
