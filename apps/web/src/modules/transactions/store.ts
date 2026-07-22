import { create } from "zustand";

import type { SortDirection } from "@/shared/infra/http/list";

import type {
  ITransaction,
  ITransactionFilters,
  TransactionOrderByField,
} from "@/modules/transactions/types/transaction";

export type TransactionsDialog =
  | { type: "create" }
  | { type: "edit"; transaction: ITransaction }
  | { type: "delete"; transactions: ITransaction[] }
  | null;

export interface ITransactionsStore {
  page: number;
  perPage: number;
  search: string;
  orderBy?: TransactionOrderByField;
  sort: SortDirection;
  filters: ITransactionFilters;
  selectedIds: string[];
  dialog: TransactionsDialog;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setSearch: (search: string) => void;
  toggleOrderBy: (field: TransactionOrderByField) => void;
  setFilters: (filters: Partial<ITransactionFilters>) => void;
  toggleSelected: (id: string) => void;
  setSelected: (ids: string[]) => void;
  clearSelected: () => void;
  openCreateDialog: () => void;
  openEditDialog: (transaction: ITransaction) => void;
  openDeleteDialog: (transactions: ITransaction[]) => void;
  closeDialog: () => void;
}

export const useTransactionsStore = create<ITransactionsStore>((set) => ({
  page: 1,
  perPage: 10,
  search: "",
  orderBy: undefined,
  sort: "asc",
  filters: {},
  selectedIds: [],
  dialog: null,
  setPage: (page) => set({ page, selectedIds: [] }),
  setPerPage: (perPage) => set({ perPage, page: 1, selectedIds: [] }),
  setSearch: (search) => set({ search, page: 1, selectedIds: [] }),
  toggleOrderBy: (field) =>
    set((state) => ({
      orderBy: field,
      sort: state.orderBy === field && state.sort === "asc" ? "desc" : "asc",
      page: 1,
      selectedIds: [],
    })),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters }, page: 1, selectedIds: [] })),
  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id],
    })),
  setSelected: (ids) => set({ selectedIds: ids }),
  clearSelected: () => set({ selectedIds: [] }),
  openCreateDialog: () => set({ dialog: { type: "create" } }),
  openEditDialog: (transaction) => set({ dialog: { type: "edit", transaction } }),
  openDeleteDialog: (transactions) => set({ dialog: { type: "delete", transactions } }),
  closeDialog: () => set({ dialog: null }),
}));
