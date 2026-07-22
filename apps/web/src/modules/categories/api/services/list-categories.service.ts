import type { IHttpClient } from "@/shared/infra/http/client";
import {
  buildListQueryParams,
  type IListParams,
  type IListResponse,
} from "@/shared/infra/http/list";

import type {
  CategoryOrderByField,
  ICategory,
  ICategoryFilters,
} from "@/modules/categories/types/category";

export type IListCategoriesParams = IListParams<CategoryOrderByField, ICategoryFilters>;

export class ListCategoriesService {
  constructor(private httpClient: IHttpClient) {}

  async execute(params: IListCategoriesParams): Promise<IListResponse<ICategory>> {
    return this.httpClient.get<IListResponse<ICategory>>("/categories", {
      params: buildListQueryParams(params),
    });
  }
}
