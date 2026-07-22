import type { IHttpClient } from "@/shared/infra/http/client";
import type { IBulkCreateResponse } from "@/shared/infra/http/bulk";

import type {
  CategoryType,
  ExpenseKind,
  ICategory,
} from "@/modules/categories/types/category";

export interface ICreateCategoryDTO {
  name: string;
  type: CategoryType;
  expenseKind?: ExpenseKind | null;
  parentId?: string | null;
}

export class CreateCategoryService {
  constructor(private httpClient: IHttpClient) {}

  async execute(dtos: ICreateCategoryDTO[]): Promise<IBulkCreateResponse<ICategory>> {
    return this.httpClient.post<IBulkCreateResponse<ICategory>, ICreateCategoryDTO[]>(
      "/categories",
      dtos,
    );
  }
}
