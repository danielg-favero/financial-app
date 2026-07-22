"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { UpdateLoanService } from "@/modules/loans/api/services/update-loan.service";
import { useRegisterPaymentModel } from "@/modules/loans/features/register-payment/register-payment.model";
import { RegisterPaymentView } from "@/modules/loans/features/register-payment/register-payment.view";
import { useLoansStore } from "@/modules/loans/store";
import type { ILoan } from "@/modules/loans/types/loan";

const httpClient = new HttpClient();
const updateLoanService = new UpdateLoanService(httpClient);

function RegisterPaymentDialog({ loan }: Readonly<{ loan: ILoan }>) {
  const model = useRegisterPaymentModel({ loan, updateLoanService });

  return <RegisterPaymentView {...model} />;
}

export function RegisterPaymentContainer() {
  const dialog = useLoansStore((state) => state.dialog);

  if (dialog?.type !== "payment") {
    return null;
  }

  return <RegisterPaymentDialog key={dialog.loan.id} loan={dialog.loan} />;
}
