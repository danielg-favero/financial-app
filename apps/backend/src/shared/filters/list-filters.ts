import type { SortDirection } from "@/shared/filters/filter-params";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

type SortableValue = string | number | boolean | Date | null | undefined;

export interface IListFiltersParams<TOrderBy extends string> {
  page: number;
  perPage: number;
  search?: string;
  orderBy?: TOrderBy;
  sort: SortDirection;
}

export interface IListFiltersOptions<T> {
  /** Values the `search` term is matched against (case-insensitive contains). */
  searchValues?: (item: T) => string[];
}

function compareSortableValues(a: SortableValue, b: SortableValue): number {
  if (a === b) {
    return 0;
  }
  if (a === null || a === undefined) {
    return -1;
  }
  if (b === null || b === undefined) {
    return 1;
  }
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b);
  }
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  if (typeof a === "boolean" && typeof b === "boolean") {
    return Number(a) - Number(b);
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  return String(a).localeCompare(String(b));
}

export function listFilters<TOrderBy extends string, T extends Record<TOrderBy, SortableValue>>(
  items: T[],
  filter: IListFiltersParams<TOrderBy>,
  options: IListFiltersOptions<T> = {},
): IFilteredResult<T> {
  const { searchValues } = options;
  const search = filter.search?.toLowerCase();
  const matched =
    search !== undefined && searchValues !== undefined
      ? items.filter((item) =>
          searchValues(item).some((value) => value.toLowerCase().includes(search)),
        )
      : items;

  const { orderBy } = filter;
  const direction = filter.sort === "desc" ? -1 : 1;
  const sorted =
    orderBy === undefined
      ? matched
      : [...matched].sort((a, b) => direction * compareSortableValues(a[orderBy], b[orderBy]));

  const total = sorted.length;
  const start = (filter.page - 1) * filter.perPage;

  return {
    data: sorted.slice(start, start + filter.perPage),
    page: filter.page,
    perPage: filter.perPage,
    total,
    totalPages: Math.ceil(total / filter.perPage),
  };
}
