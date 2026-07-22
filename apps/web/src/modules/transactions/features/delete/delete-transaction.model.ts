import { useDeleteTransaction } from "@/modules/transactions/api/mutations/useDeleteTransaction";
import type { DeleteTransactionService } from "@/modules/transactions/api/services/delete-transaction.service";
import { deleteTransactionMessages } from "@/modules/transactions/features/delete/delete-transaction.messages";
import { useTransactionsStore } from "@/modules/transactions/store";
import type { ITransaction } from "@/modules/transactions/types/transaction";

export interface IDeleteTransactionModel {
  transactionDescriptions: string[];
  onConfirm: () => void;
  onClose: () => void;
  isDeleting: boolean;
}

interface IDeleteTransactionModelParams {
  transactions: ITransaction[];
  deleteTransactionService: DeleteTransactionService;
}

export function useDeleteTransactionModel({
  transactions,
  deleteTransactionService,
}: IDeleteTransactionModelParams): IDeleteTransactionModel {
  const closeDialog = useTransactionsStore((state) => state.closeDialog);
  const clearSelected = useTransactionsStore((state) => state.clearSelected);
  const deleteTransaction = useDeleteTransaction({
    deleteTransactionService,
    meta: {
      successMessage: deleteTransactionMessages.success,
      partialMessage: deleteTransactionMessages.partial,
    },
  });

  const onConfirm = () => {
    deleteTransaction.mutate(
      transactions.map((transaction) => transaction.id),
      {
        onSuccess: (result) => {
          clearSelected();
          if (result.failed.length === 0) {
            closeDialog();
          }
        },
      },
    );
  };

  return {
    transactionDescriptions: transactions.map(
      (transaction) => transaction.description ?? "—",
    ),
    onConfirm,
    onClose: closeDialog,
    isDeleting: deleteTransaction.isPending,
  };
}
