import type { IFilter } from "@/shared/filters/filter";

export const categoryOrderByFields = ["name", "type", "createdAt"] as const;

export type CategoryOrderByField = (typeof categoryOrderByFields)[number];

export interface ICategoryFiltersDTO {
  parentId?: string;
}

export type IListCategoriesFilterDTO = IFilter<CategoryOrderByField, ICategoryFiltersDTO>;
