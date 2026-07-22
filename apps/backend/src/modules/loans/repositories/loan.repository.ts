import type { Loan } from "@/modules/loans/domain/entities/loan";
import type { IListLoansFilterDTO } from "@/modules/loans/dtos/list-loans-filter.dto";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

export interface ICreateLoanData {
  userId: string;
  loanDate: Date;
  personName: string;
  description: string;
  amountLent: number;
  amountReceived: number;
  openBalance: number;
  isPaid: boolean;
}

export interface IUpdateLoanData {
  loanDate?: Date;
  personName?: string;
  description?: string;
  amountLent?: number;
  amountReceived?: number;
  openBalance?: number;
  isPaid?: boolean;
}

export interface ILoanRepository {
  create(data: ICreateLoanData): Promise<Loan>;
  findById(id: string): Promise<Loan | null>;
  findManyByUserId(userId: string, filter: IListLoansFilterDTO): Promise<IFilteredResult<Loan>>;
  update(id: string, data: IUpdateLoanData): Promise<Loan>;
  delete(id: string): Promise<void>;
}
