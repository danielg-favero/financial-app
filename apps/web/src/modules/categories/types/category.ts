export const CategoryType = {
  RECEITA: "RECEITA",
  INVESTIMENTO: "INVESTIMENTO",
  DESPESA: "DESPESA",
} as const;

export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

export const ExpenseKind = {
  FIXA: "FIXA",
  VARIAVEL: "VARIAVEL",
} as const;

export type ExpenseKind = (typeof ExpenseKind)[keyof typeof ExpenseKind];

/** pt-BR display labels — presentation layer only, never sent to the API. */
export const CATEGORY_TYPE_LABELS: Record<CategoryType, string> = {
  RECEITA: "Receita",
  INVESTIMENTO: "Investimento",
  DESPESA: "Despesa",
};

export const EXPENSE_KIND_LABELS: Record<ExpenseKind, string> = {
  FIXA: "Fixa",
  VARIAVEL: "Variável",
};

export interface ICategory {
  id: string;
  parentId: string | null;
  name: string;
  type: CategoryType;
  expenseKind: ExpenseKind | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICategoryResponse {
  category: ICategory;
}

export const categoryOrderByFields = ["name", "type", "createdAt"] as const;

export type CategoryOrderByField = (typeof categoryOrderByFields)[number];

export interface ICategoryFilters {
  parentId?: string;
}
