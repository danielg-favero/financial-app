export interface ILoanProps {
  id: string;
  userId: string;
  loanDate: Date;
  personName: string;
  description: string;
  amountLent: number;
  amountReceived: number;
  openBalance: number;
  isPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Loan {
  readonly id: string;
  readonly userId: string;
  readonly loanDate: Date;
  readonly personName: string;
  readonly description: string;
  readonly amountLent: number;
  readonly amountReceived: number;
  readonly openBalance: number;
  readonly isPaid: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ILoanProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.loanDate = props.loanDate;
    this.personName = props.personName;
    this.description = props.description;
    this.amountLent = props.amountLent;
    this.amountReceived = props.amountReceived;
    this.openBalance = props.openBalance;
    this.isPaid = props.isPaid;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
