"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { CreateCategoryService } from "@/modules/categories/api/services/create-category.service";
import { ListCategoriesForSelectService } from "@/modules/categories/api/services/list-categories-for-select.service";
import { useCreateCategoryModel } from "@/modules/categories/features/create/create-category.model";
import { CreateCategoryView } from "@/modules/categories/features/create/create-category.view";
import { useCategoriesStore } from "@/modules/categories/store";

const httpClient = new HttpClient();
const createCategoryService = new CreateCategoryService(httpClient);
const listCategoriesForSelectService = new ListCategoriesForSelectService(httpClient);

function CreateCategoryDialog() {
  const model = useCreateCategoryModel({
    createCategoryService,
    listCategoriesForSelectService,
  });

  return <CreateCategoryView {...model} />;
}

export function CreateCategoryContainer() {
  const dialog = useCategoriesStore((state) => state.dialog);

  if (dialog?.type !== "create") {
    return null;
  }

  return <CreateCategoryDialog />;
}
