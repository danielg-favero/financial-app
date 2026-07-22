import type { IFilterParams, SortDirection } from "@/shared/filters/filter-params";

export interface IFilter<TOrderBy extends string = string, TFilters = undefined>
  extends IFilterParams {
  page: number;
  perPage: number;
  orderBy?: TOrderBy;
  sort: SortDirection;
  filters?: TFilters;
}
