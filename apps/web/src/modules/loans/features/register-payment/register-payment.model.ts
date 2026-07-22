import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { useRegisterLoanPayment } from "@/modules/loans/api/mutations/useRegisterLoanPayment";
import type { UpdateLoanService } from "@/modules/loans/api/services/update-loan.service";
import { parseMoney } from "@/modules/loans/components/loan-form";
import { registerPaymentMessages } from "@/modules/loans/features/register-payment/register-payment.messages";
import { useLoansStore } from "@/modules/loans/store";
import type { ILoan } from "@/modules/loans/types/loan";

export interface IRegisterPaymentFormValues {
  paymentAmount: string;
}

export interface IRegisterPaymentModel {
  personName: string;
  openBalance: number;
  form: UseFormReturn<IRegisterPaymentFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

function createRegisterPaymentSchema(openBalance: number) {
  return z.object({
    paymentAmount: z
      .string()
      .min(1, registerPaymentMessages.validation.amount)
      .refine((value) => {
        const amount = parseMoney(value);
        return Number.isFinite(amount) && amount > 0;
      }, registerPaymentMessages.validation.amount)
      .refine(
        (value) => parseMoney(value) <= openBalance,
        registerPaymentMessages.validation.exceedsBalance,
      ),
  });
}

interface IRegisterPaymentModelParams {
  loan: ILoan;
  updateLoanService: UpdateLoanService;
}

export function useRegisterPaymentModel({
  loan,
  updateLoanService,
}: IRegisterPaymentModelParams): IRegisterPaymentModel {
  const closeDialog = useLoansStore((state) => state.closeDialog);
  const form = useForm<IRegisterPaymentFormValues>({
    resolver: zodResolver(createRegisterPaymentSchema(loan.openBalance)),
    defaultValues: { paymentAmount: "" },
  });
  const registerPayment = useRegisterLoanPayment({
    updateLoanService,
    meta: { successMessage: registerPaymentMessages.success },
  });

  const onSubmit = form.handleSubmit((values) => {
    registerPayment.mutate(
      { loan, paymentAmount: parseMoney(values.paymentAmount) },
      { onSuccess: closeDialog },
    );
  });

  return {
    personName: loan.personName,
    openBalance: loan.openBalance,
    form,
    onSubmit,
    onClose: closeDialog,
    isSubmitting: registerPayment.isPending,
  };
}
