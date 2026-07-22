"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { UpdateLoanService } from "@/modules/loans/api/services/update-loan.service";
import { useEditLoanModel } from "@/modules/loans/features/edit/edit-loan.model";
import { EditLoanView } from "@/modules/loans/features/edit/edit-loan.view";
import { useLoansStore } from "@/modules/loans/store";
import type { ILoan } from "@/modules/loans/types/loan";

const httpClient = new HttpClient();
const updateLoanService = new UpdateLoanService(httpClient);

function EditLoanDialog({ loan }: Readonly<{ loan: ILoan }>) {
  const model = useEditLoanModel({ loan, updateLoanService });

  return <EditLoanView {...model} />;
}

export function EditLoanContainer() {
  const dialog = useLoansStore((state) => state.dialog);

  if (dialog?.type !== "edit") {
    return null;
  }

  return <EditLoanDialog key={dialog.loan.id} loan={dialog.loan} />;
}
