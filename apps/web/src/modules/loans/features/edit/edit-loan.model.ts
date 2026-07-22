import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

import { useUpdateLoan } from "@/modules/loans/api/mutations/useUpdateLoan";
import type { UpdateLoanService } from "@/modules/loans/api/services/update-loan.service";
import {
  loanFormSchema,
  parseMoney,
  type ILoanFormValues,
} from "@/modules/loans/components/loan-form";
import { editLoanMessages } from "@/modules/loans/features/edit/edit-loan.messages";
import { useLoansStore } from "@/modules/loans/store";
import type { ILoan } from "@/modules/loans/types/loan";

export interface IEditLoanModel {
  form: UseFormReturn<ILoanFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

/** Edits loan metadata only — payment fields go through the register-payment feature. */
interface IEditLoanModelParams {
  loan: ILoan;
  updateLoanService: UpdateLoanService;
}

export function useEditLoanModel({
  loan,
  updateLoanService,
}: IEditLoanModelParams): IEditLoanModel {
  const closeDialog = useLoansStore((state) => state.closeDialog);
  const form = useForm<ILoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      personName: loan.personName,
      description: loan.description,
      loanDate: loan.loanDate,
      amountLent: String(loan.amountLent),
    },
  });
  const updateLoan = useUpdateLoan({
    updateLoanService,
    meta: { successMessage: editLoanMessages.success },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateLoan.mutate(
      {
        id: loan.id,
        dto: {
          personName: values.personName,
          description: values.description,
          loanDate: values.loanDate,
          amountLent: parseMoney(values.amountLent),
        },
      },
      { onSuccess: closeDialog },
    );
  });

  return {
    form,
    onSubmit,
    onClose: closeDialog,
    isSubmitting: updateLoan.isPending,
  };
}
