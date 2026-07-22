import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

import { useCreateTransaction } from "@/modules/transactions/api/mutations/useCreateTransaction";
import type { CreateTransactionService } from "@/modules/transactions/api/services/create-transaction.service";
import { parseAmount } from "@/modules/transactions/components/transaction-form";
import {
  createEmptyTransactionItem,
  transactionBulkFormSchema,
  type ITransactionBulkFormValues,
} from "@/modules/transactions/components/transaction-bulk-form";
import { createTransactionMessages } from "@/modules/transactions/features/create/create-transaction.messages";
import { useTransactionsStore } from "@/modules/transactions/store";

export interface ICreateTransactionModel {
  form: UseFormReturn<ITransactionBulkFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

interface ICreateTransactionModelParams {
  createTransactionService: CreateTransactionService;
}

export function useCreateTransactionModel({
  createTransactionService,
}: ICreateTransactionModelParams): ICreateTransactionModel {
  const closeDialog = useTransactionsStore((state) => state.closeDialog);
  const form = useForm<ITransactionBulkFormValues>({
    resolver: zodResolver(transactionBulkFormSchema),
    defaultValues: {
      items: [createEmptyTransactionItem()],
    },
  });
  const createTransaction = useCreateTransaction({
    createTransactionService,
    meta: {
      successMessage: createTransactionMessages.success,
      partialMessage: createTransactionMessages.partial,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    createTransaction.mutate(
      values.items.map((item) => ({
        description: item.description.trim() || null,
        amount: parseAmount(item.amount),
        categoryId: item.categoryId,
        transactionDate: item.transactionDate,
        referenceMonth: Number(item.referenceMonth),
        referenceYear: Number(item.referenceYear),
      })),
      {
        onSuccess: (result) => {
          if (result.failed.length === 0) {
            closeDialog();
          }
        },
      },
    );
  });

  return {
    form,
    onSubmit,
    onClose: closeDialog,
    isSubmitting: createTransaction.isPending,
  };
}
