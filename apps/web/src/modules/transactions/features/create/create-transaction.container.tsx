"use client";

import { HttpClient } from "@/shared/infra/http/client";

import {
  ListCategoriesForSelectService,
  useGetCategoriesForSelect,
} from "@/modules/categories";
import { CreateTransactionService } from "@/modules/transactions/api/services/create-transaction.service";
import { useCreateTransactionModel } from "@/modules/transactions/features/create/create-transaction.model";
import { CreateTransactionView } from "@/modules/transactions/features/create/create-transaction.view";
import { useTransactionsStore } from "@/modules/transactions/store";

const httpClient = new HttpClient();
const createTransactionService = new CreateTransactionService(httpClient);
const listCategoriesForSelectService = new ListCategoriesForSelectService(httpClient);

function CreateTransactionDialog() {
  const model = useCreateTransactionModel({ createTransactionService });
  const categoriesQuery = useGetCategoriesForSelect({ listCategoriesForSelectService });

  return <CreateTransactionView {...model} categoryOptions={categoriesQuery.data ?? []} />;
}

export function CreateTransactionContainer() {
  const dialog = useTransactionsStore((state) => state.dialog);

  if (dialog?.type !== "create") {
    return null;
  }

  return <CreateTransactionDialog />;
}
