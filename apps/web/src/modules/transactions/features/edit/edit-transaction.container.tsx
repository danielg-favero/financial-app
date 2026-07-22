"use client";

import { HttpClient } from "@/shared/infra/http/client";

import {
  ListCategoriesForSelectService,
  useGetCategoriesForSelect,
} from "@/modules/categories";
import { UpdateTransactionService } from "@/modules/transactions/api/services/update-transaction.service";
import { useEditTransactionModel } from "@/modules/transactions/features/edit/edit-transaction.model";
import { EditTransactionView } from "@/modules/transactions/features/edit/edit-transaction.view";
import { useTransactionsStore } from "@/modules/transactions/store";
import type { ITransaction } from "@/modules/transactions/types/transaction";

const httpClient = new HttpClient();
const updateTransactionService = new UpdateTransactionService(httpClient);
const listCategoriesForSelectService = new ListCategoriesForSelectService(httpClient);

function EditTransactionDialog({ transaction }: Readonly<{ transaction: ITransaction }>) {
  const model = useEditTransactionModel({ transaction, updateTransactionService });
  const categoriesQuery = useGetCategoriesForSelect({ listCategoriesForSelectService });

  return <EditTransactionView {...model} categoryOptions={categoriesQuery.data ?? []} />;
}

export function EditTransactionContainer() {
  const dialog = useTransactionsStore((state) => state.dialog);

  if (dialog?.type !== "edit") {
    return null;
  }

  return (
    <EditTransactionDialog key={dialog.transaction.id} transaction={dialog.transaction} />
  );
}
