import type { IListCategoriesParams } from "@/modules/categories/api/services/list-categories.service";

export const categoryQueryKeys = {
  root: ["categories"] as const,
  list: (params: IListCategoriesParams) => ["categories", "list", params] as const,
  select: ["categories", "select"] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};
