import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

import { useUpdateTransaction } from "@/modules/transactions/api/mutations/useUpdateTransaction";
import type { UpdateTransactionService } from "@/modules/transactions/api/services/update-transaction.service";
import {
  parseAmount,
  transactionFormSchema,
  type ITransactionFormValues,
} from "@/modules/transactions/components/transaction-form";
import { editTransactionMessages } from "@/modules/transactions/features/edit/edit-transaction.messages";
import { useTransactionsStore } from "@/modules/transactions/store";
import type { ITransaction } from "@/modules/transactions/types/transaction";

export interface IEditTransactionModel {
  form: UseFormReturn<ITransactionFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

interface IEditTransactionModelParams {
  transaction: ITransaction;
  updateTransactionService: UpdateTransactionService;
}

export function useEditTransactionModel({
  transaction,
  updateTransactionService,
}: IEditTransactionModelParams): IEditTransactionModel {
  const closeDialog = useTransactionsStore((state) => state.closeDialog);
  const form = useForm<ITransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: transaction.description ?? "",
      amount: String(transaction.amount),
      categoryId: transaction.categoryId,
      transactionDate: transaction.transactionDate,
      referenceMonth: String(transaction.referenceMonth),
      referenceYear: String(transaction.referenceYear),
    },
  });
  const updateTransaction = useUpdateTransaction({
    updateTransactionService,
    meta: { successMessage: editTransactionMessages.success },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateTransaction.mutate(
      {
        id: transaction.id,
        dto: {
          description: values.description.trim() || null,
          amount: parseAmount(values.amount),
          categoryId: values.categoryId,
          transactionDate: values.transactionDate,
          referenceMonth: Number(values.referenceMonth),
          referenceYear: Number(values.referenceYear),
        },
      },
      { onSuccess: closeDialog },
    );
  });

  return {
    form,
    onSubmit,
    onClose: closeDialog,
    isSubmitting: updateTransaction.isPending,
  };
}
