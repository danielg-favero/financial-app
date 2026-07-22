"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { DeleteTransactionService } from "@/modules/transactions/api/services/delete-transaction.service";
import { useDeleteTransactionModel } from "@/modules/transactions/features/delete/delete-transaction.model";
import { DeleteTransactionView } from "@/modules/transactions/features/delete/delete-transaction.view";
import { useTransactionsStore } from "@/modules/transactions/store";
import type { ITransaction } from "@/modules/transactions/types/transaction";

const httpClient = new HttpClient();
const deleteTransactionService = new DeleteTransactionService(httpClient);

function DeleteTransactionDialog({ transactions }: Readonly<{ transactions: ITransaction[] }>) {
  const model = useDeleteTransactionModel({ transactions, deleteTransactionService });

  return <DeleteTransactionView {...model} />;
}

export function DeleteTransactionContainer() {
  const dialog = useTransactionsStore((state) => state.dialog);

  if (dialog?.type !== "delete") {
    return null;
  }

  return (
    <DeleteTransactionDialog
      key={dialog.transactions.map((transaction) => transaction.id).join(",")}
      transactions={dialog.transactions}
    />
  );
}
