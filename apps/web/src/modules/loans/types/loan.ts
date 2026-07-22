export interface ILoan {
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

export interface ILoanResponse {
  loan: ILoan;
}

export const loanOrderByFields = [
  "personName",
  "loanDate",
  "amountLent",
  "openBalance",
  "isPaid",
] as const;

export type LoanOrderByField = (typeof loanOrderByFields)[number];
