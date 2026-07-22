import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

import { useCreateLoan } from "@/modules/loans/api/mutations/useCreateLoan";
import type { CreateLoanService } from "@/modules/loans/api/services/create-loan.service";
import { parseMoney } from "@/modules/loans/components/loan-form";
import {
  createEmptyLoanItem,
  loanBulkFormSchema,
  type ILoanBulkFormValues,
} from "@/modules/loans/components/loan-bulk-form";
import { createLoanMessages } from "@/modules/loans/features/create/create-loan.messages";
import { useLoansStore } from "@/modules/loans/store";

export interface ICreateLoanModel {
  form: UseFormReturn<ILoanBulkFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

interface ICreateLoanModelParams {
  createLoanService: CreateLoanService;
}

export function useCreateLoanModel({
  createLoanService,
}: ICreateLoanModelParams): ICreateLoanModel {
  const closeDialog = useLoansStore((state) => state.closeDialog);
  const form = useForm<ILoanBulkFormValues>({
    resolver: zodResolver(loanBulkFormSchema),
    defaultValues: {
      items: [createEmptyLoanItem()],
    },
  });
  const createLoan = useCreateLoan({
    createLoanService,
    meta: {
      successMessage: createLoanMessages.success,
      partialMessage: createLoanMessages.partial,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    createLoan.mutate(
      values.items.map((item) => ({
        personName: item.personName,
        description: item.description,
        loanDate: item.loanDate,
        amountLent: parseMoney(item.amountLent),
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
    isSubmitting: createLoan.isPending,
  };
}
