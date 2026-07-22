import type { Metadata } from "next";

import {
  CreateLoanContainer,
  DeleteLoanContainer,
  EditLoanContainer,
  LoansListContainer,
  RegisterPaymentContainer,
} from "@/modules/loans";

export const metadata: Metadata = {
  title: "Empréstimos",
};

export default function LoansPage() {
  return (
    <>
      <LoansListContainer />
      <CreateLoanContainer />
      <EditLoanContainer />
      <DeleteLoanContainer />
      <RegisterPaymentContainer />
    </>
  );
}
