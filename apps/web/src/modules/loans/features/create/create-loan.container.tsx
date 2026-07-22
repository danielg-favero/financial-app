"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { CreateLoanService } from "@/modules/loans/api/services/create-loan.service";
import { useCreateLoanModel } from "@/modules/loans/features/create/create-loan.model";
import { CreateLoanView } from "@/modules/loans/features/create/create-loan.view";
import { useLoansStore } from "@/modules/loans/store";

const httpClient = new HttpClient();
const createLoanService = new CreateLoanService(httpClient);

function CreateLoanDialog() {
  const model = useCreateLoanModel({ createLoanService });

  return <CreateLoanView {...model} />;
}

export function CreateLoanContainer() {
  const dialog = useLoansStore((state) => state.dialog);

  if (dialog?.type !== "create") {
    return null;
  }

  return <CreateLoanDialog />;
}
