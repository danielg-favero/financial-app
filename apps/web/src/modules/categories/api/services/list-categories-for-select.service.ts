import type { IHttpClient } from "@/shared/infra/http/client";
import { buildListQueryParams, type IListResponse } from "@/shared/infra/http/list";

import type { ICategory } from "@/modules/categories/types/category";

const SELECT_PAGE_SIZE = 100;

/** Every category of the user, ordered by name — for pickers/selects. */
export class ListCategoriesForSelectService {
  constructor(private httpClient: IHttpClient) {}

  async execute(): Promise<ICategory[]> {
    const response = await this.httpClient.get<IListResponse<ICategory>>("/categories", {
      params: buildListQueryParams({
        page: 1,
        perPage: SELECT_PAGE_SIZE,
        orderBy: "name",
        sort: "asc",
      }),
    });
    return response.data;
  }
}
