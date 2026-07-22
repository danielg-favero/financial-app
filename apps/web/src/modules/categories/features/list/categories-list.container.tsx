"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { ListCategoriesForSelectService } from "@/modules/categories/api/services/list-categories-for-select.service";
import { ListCategoriesService } from "@/modules/categories/api/services/list-categories.service";
import { useCategoriesListModel } from "@/modules/categories/features/list/categories-list.model";
import { CategoriesListView } from "@/modules/categories/features/list/categories-list.view";

const httpClient = new HttpClient();
const listCategoriesService = new ListCategoriesService(httpClient);
const listCategoriesForSelectService = new ListCategoriesForSelectService(httpClient);

export function CategoriesListContainer() {
  const model = useCategoriesListModel({
    listCategoriesService,
    listCategoriesForSelectService,
  });

  return <CategoriesListView {...model} />;
}
