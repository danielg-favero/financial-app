import type { CategoryType, ExpenseKind } from "@/modules/categories/domain/entities/category";

export interface ITransactionCategory {
  id: string;
  name: string;
  type: CategoryType;
  expenseKind: ExpenseKind | null;
}

export interface ITransactionProps {
  id: string;
  userId: string;
  categoryId: string;
  description: string | null;
  amount: number;
  referenceMonth: number;
  referenceYear: number;
  transactionDate: Date;
  category: ITransactionCategory;
  createdAt: Date;
  updatedAt: Date;
}

export class Transaction {
  readonly id: string;
  readonly userId: string;
  readonly categoryId: string;
  readonly description: string | null;
  readonly amount: number;
  readonly referenceMonth: number;
  readonly referenceYear: number;
  readonly transactionDate: Date;
  readonly category: ITransactionCategory;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ITransactionProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.categoryId = props.categoryId;
    this.description = props.description;
    this.amount = props.amount;
    this.referenceMonth = props.referenceMonth;
    this.referenceYear = props.referenceYear;
    this.transactionDate = props.transactionDate;
    this.category = props.category;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
