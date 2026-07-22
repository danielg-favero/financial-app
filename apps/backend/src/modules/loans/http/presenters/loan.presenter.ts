import type { Loan } from "@/modules/loans/domain/entities/loan";

export interface ILoanResponse {
  id: string;
  loanDate: string;
  personName: string;
  description: string;
  amountLent: number;
  amountReceived: number;
  openBalance: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export function presentLoan(loan: Loan): ILoanResponse {
  return {
    id: loan.id,
    loanDate: loan.loanDate.toISOString().slice(0, 10),
    personName: loan.personName,
    description: loan.description,
    amountLent: loan.amountLent,
    amountReceived: loan.amountReceived,
    openBalance: loan.openBalance,
    isPaid: loan.isPaid,
    createdAt: loan.createdAt.toISOString(),
    updatedAt: loan.updatedAt.toISOString(),
  };
}
