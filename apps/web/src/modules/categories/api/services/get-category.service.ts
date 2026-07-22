import type { IHttpClient } from "@/shared/infra/http/client";

import type { ICategory, ICategoryResponse } from "@/modules/categories/types/category";

export class GetCategoryService {
  constructor(private httpClient: IHttpClient) {}

  async execute(id: string): Promise<ICategory> {
    const response = await this.httpClient.get<ICategoryResponse>(`/categories/${id}`);
    return response.category;
  }
}
