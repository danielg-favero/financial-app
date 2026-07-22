import type { Metadata } from "next";

import {
  CategoriesListContainer,
  CreateCategoryContainer,
  DeleteCategoryContainer,
  EditCategoryContainer,
} from "@/modules/categories";

export const metadata: Metadata = {
  title: "Categorias",
};

export default function CategoriesPage() {
  return (
    <>
      <CategoriesListContainer />
      <CreateCategoryContainer />
      <EditCategoryContainer />
      <DeleteCategoryContainer />
    </>
  );
}
