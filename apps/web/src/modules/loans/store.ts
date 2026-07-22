import { create } from "zustand";

import type { SortDirection } from "@/shared/infra/http/list";

import type { ILoan, LoanOrderByField } from "@/modules/loans/types/loan";

export type LoansDialog =
  | { type: "create" }
  | { type: "edit"; loan: ILoan }
  | { type: "delete"; loans: ILoan[] }
  | { type: "payment"; loan: ILoan }
  | null;

export interface ILoansStore {
  page: number;
  perPage: number;
  search: string;
  orderBy?: LoanOrderByField;
  sort: SortDirection;
  selectedIds: string[];
  dialog: LoansDialog;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setSearch: (search: string) => void;
  toggleOrderBy: (field: LoanOrderByField) => void;
  toggleSelected: (id: string) => void;
  setSelected: (ids: string[]) => void;
  clearSelected: () => void;
  openCreateDialog: () => void;
  openEditDialog: (loan: ILoan) => void;
  openDeleteDialog: (loans: ILoan[]) => void;
  openPaymentDialog: (loan: ILoan) => void;
  closeDialog: () => void;
}

export const useLoansStore = create<ILoansStore>((set) => ({
  page: 1,
  perPage: 10,
  search: "",
  orderBy: undefined,
  sort: "asc",
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
  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id],
    })),
  setSelected: (ids) => set({ selectedIds: ids }),
  clearSelected: () => set({ selectedIds: [] }),
  openCreateDialog: () => set({ dialog: { type: "create" } }),
  openEditDialog: (loan) => set({ dialog: { type: "edit", loan } }),
  openDeleteDialog: (loans) => set({ dialog: { type: "delete", loans } }),
  openPaymentDialog: (loan) => set({ dialog: { type: "payment", loan } }),
  closeDialog: () => set({ dialog: null }),
}));
