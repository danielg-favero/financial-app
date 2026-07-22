export interface ICreateLoanDTO {
  userId: string;
  loanDate: Date;
  personName: string;
  description: string;
  amountLent: number;
  amountReceived?: number;
}
