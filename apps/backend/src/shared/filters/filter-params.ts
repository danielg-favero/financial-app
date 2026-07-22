export type SortDirection = "asc" | "desc";

export interface IFilterParams {
  page?: number;
  perPage?: number;
  search?: string;
  orderBy?: string;
  sort?: SortDirection;
}
