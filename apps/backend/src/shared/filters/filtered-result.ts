export interface IFilteredResult<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
