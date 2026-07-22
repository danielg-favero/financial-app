"use client";

import { HttpClient } from "@/shared/infra/http/client";

import {
  ListCategoriesForSelectService,
  useGetCategoriesForSelect,
} from "@/modules/categories";
import { ListTransactionsService } from "@/modules/transactions/api/services/list-transactions.service";
import { useTransactionsListModel } from "@/modules/transactions/features/list/transactions-list.model";
import { TransactionsListView } from "@/modules/transactions/features/list/transactions-list.view";

const httpClient = new HttpClient();
const listTransactionsService = new ListTransactionsService(httpClient);
const listCategoriesForSelectService = new ListCategoriesForSelectService(httpClient);

export function TransactionsListContainer() {
  const model = useTransactionsListModel({ listTransactionsService });
  const categoriesQuery = useGetCategoriesForSelect({ listCategoriesForSelectService });

  return <TransactionsListView {...model} categoryOptions={categoriesQuery.data ?? []} />;
}
