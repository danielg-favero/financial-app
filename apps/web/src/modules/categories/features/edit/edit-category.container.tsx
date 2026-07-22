"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { ListCategoriesForSelectService } from "@/modules/categories/api/services/list-categories-for-select.service";
import { UpdateCategoryService } from "@/modules/categories/api/services/update-category.service";
import { useEditCategoryModel } from "@/modules/categories/features/edit/edit-category.model";
import { EditCategoryView } from "@/modules/categories/features/edit/edit-category.view";
import { useCategoriesStore } from "@/modules/categories/store";
import type { ICategory } from "@/modules/categories/types/category";

const httpClient = new HttpClient();
const updateCategoryService = new UpdateCategoryService(httpClient);
const listCategoriesForSelectService = new ListCategoriesForSelectService(httpClient);

function EditCategoryDialog({ category }: Readonly<{ category: ICategory }>) {
  const model = useEditCategoryModel({
    category,
    updateCategoryService,
    listCategoriesForSelectService,
  });

  return <EditCategoryView {...model} />;
}

export function EditCategoryContainer() {
  const dialog = useCategoriesStore((state) => state.dialog);

  if (dialog?.type !== "edit") {
    return null;
  }

  return <EditCategoryDialog key={dialog.category.id} category={dialog.category} />;
}
