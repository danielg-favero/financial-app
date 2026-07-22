import type { CategoryType, ExpenseKind } from "@/modules/categories/domain/entities/category";

export interface ICreateCategoryDTO {
  userId: string;
  name: string;
  type: CategoryType;
  expenseKind?: ExpenseKind | null;
  parentId?: string | null;
}
