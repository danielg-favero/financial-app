"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { DeleteLoanService } from "@/modules/loans/api/services/delete-loan.service";
import { useDeleteLoanModel } from "@/modules/loans/features/delete/delete-loan.model";
import { DeleteLoanView } from "@/modules/loans/features/delete/delete-loan.view";
import { useLoansStore } from "@/modules/loans/store";
import type { ILoan } from "@/modules/loans/types/loan";

const httpClient = new HttpClient();
const deleteLoanService = new DeleteLoanService(httpClient);

function DeleteLoanDialog({ loans }: Readonly<{ loans: ILoan[] }>) {
  const model = useDeleteLoanModel({ loans, deleteLoanService });

  return <DeleteLoanView {...model} />;
}

export function DeleteLoanContainer() {
  const dialog = useLoansStore((state) => state.dialog);

  if (dialog?.type !== "delete") {
    return null;
  }

  return (
    <DeleteLoanDialog key={dialog.loans.map((loan) => loan.id).join(",")} loans={dialog.loans} />
  );
}
