import type { CategoryType, ExpenseKind } from "@/modules/categories/domain/entities/category";

export interface IUpdateCategoryDTO {
  name?: string;
  type?: CategoryType;
  expenseKind?: ExpenseKind | null;
  parentId?: string | null;
}
