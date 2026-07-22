export const CategoryType = {
  RECEITA: "RECEITA",
  INVESTIMENTO: "INVESTIMENTO",
  DESPESA: "DESPESA",
} as const;

export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

export const ExpenseKind = {
  FIXA: "FIXA",
  VARIAVEL: "VARIAVEL",
} as const;

export type ExpenseKind = (typeof ExpenseKind)[keyof typeof ExpenseKind];

export interface ICategoryProps {
  id: string;
  userId: string;
  parentId: string | null;
  name: string;
  type: CategoryType;
  expenseKind: ExpenseKind | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Category {
  readonly id: string;
  readonly userId: string;
  readonly parentId: string | null;
  readonly name: string;
  readonly type: CategoryType;
  readonly expenseKind: ExpenseKind | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ICategoryProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.parentId = props.parentId;
    this.name = props.name;
    this.type = props.type;
    this.expenseKind = props.expenseKind;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
