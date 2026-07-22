"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { DeleteCategoryService } from "@/modules/categories/api/services/delete-category.service";
import { useDeleteCategoryModel } from "@/modules/categories/features/delete/delete-category.model";
import { DeleteCategoryView } from "@/modules/categories/features/delete/delete-category.view";
import { useCategoriesStore } from "@/modules/categories/store";
import type { ICategory } from "@/modules/categories/types/category";

const httpClient = new HttpClient();
const deleteCategoryService = new DeleteCategoryService(httpClient);

function DeleteCategoryDialog({ categories }: Readonly<{ categories: ICategory[] }>) {
  const model = useDeleteCategoryModel({ categories, deleteCategoryService });

  return <DeleteCategoryView {...model} />;
}

export function DeleteCategoryContainer() {
  const dialog = useCategoriesStore((state) => state.dialog);

  if (dialog?.type !== "delete") {
    return null;
  }

  return (
    <DeleteCategoryDialog
      key={dialog.categories.map((category) => category.id).join(",")}
      categories={dialog.categories}
    />
  );
}
