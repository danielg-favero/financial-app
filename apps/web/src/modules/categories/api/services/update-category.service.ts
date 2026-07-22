import type { IHttpClient } from "@/shared/infra/http/client";

import type {
  CategoryType,
  ExpenseKind,
  ICategory,
  ICategoryResponse,
} from "@/modules/categories/types/category";

export interface IUpdateCategoryDTO {
  name?: string;
  type?: CategoryType;
  expenseKind?: ExpenseKind | null;
  parentId?: string | null;
}

export interface IUpdateCategoryInput {
  id: string;
  dto: IUpdateCategoryDTO;
}

export class UpdateCategoryService {
  constructor(private httpClient: IHttpClient) {}

  async execute({ id, dto }: IUpdateCategoryInput): Promise<ICategory> {
    const response = await this.httpClient.patch<ICategoryResponse, IUpdateCategoryDTO>(
      `/categories/${id}`,
      dto,
    );
    return response.category;
  }
}
