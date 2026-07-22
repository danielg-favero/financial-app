export type SortDirection = "asc" | "desc";

export interface IListParams<TOrderBy extends string, TFilters = undefined> {
  page: number;
  perPage: number;
  search?: string;
  orderBy?: TOrderBy;
  sort: SortDirection;
  filters?: TFilters;
}

export interface IListResponse<TItem> {
  data: TItem[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

/**
 * Serializes list params for the backend contract: scalar params as plain
 * query params and entity-specific filters as a JSON-encoded `filters` param.
 */
export function buildListQueryParams<TOrderBy extends string, TFilters>(
  params: IListParams<TOrderBy, TFilters>,
): Record<string, string> {
  const query: Record<string, string> = {
    page: String(params.page),
    perPage: String(params.perPage),
    sort: params.sort,
  };

  if (params.search) {
    query.search = params.search;
  }
  if (params.orderBy) {
    query.orderBy = params.orderBy;
  }
  if (params.filters && Object.values(params.filters).some((value) => value !== undefined)) {
    query.filters = JSON.stringify(params.filters);
  }

  return query;
}
