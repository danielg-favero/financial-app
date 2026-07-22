import { create } from "zustand";

import type { SortDirection } from "@/shared/infra/http/list";

import type { CategoryOrderByField, ICategory } from "@/modules/categories/types/category";

export type CategoriesDialog =
  | { type: "create" }
  | { type: "edit"; category: ICategory }
  | { type: "delete"; categories: ICategory[] }
  | null;

export interface ICategoriesStore {
  page: number;
  perPage: number;
  search: string;
  orderBy?: CategoryOrderByField;
  sort: SortDirection;
  parentId?: string;
  selectedIds: string[];
  dialog: CategoriesDialog;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setSearch: (search: string) => void;
  toggleOrderBy: (field: CategoryOrderByField) => void;
  setParentFilter: (parentId?: string) => void;
  toggleSelected: (id: string) => void;
  setSelected: (ids: string[]) => void;
  clearSelected: () => void;
  openCreateDialog: () => void;
  openEditDialog: (category: ICategory) => void;
  openDeleteDialog: (categories: ICategory[]) => void;
  closeDialog: () => void;
}

export const useCategoriesStore = create<ICategoriesStore>((set) => ({
  page: 1,
  perPage: 10,
  search: "",
  orderBy: undefined,
  sort: "asc",
  parentId: undefined,
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
  setParentFilter: (parentId) => set({ parentId, page: 1, selectedIds: [] }),
  toggleSelected: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id],
    })),
  setSelected: (ids) => set({ selectedIds: ids }),
  clearSelected: () => set({ selectedIds: [] }),
  openCreateDialog: () => set({ dialog: { type: "create" } }),
  openEditDialog: (category) => set({ dialog: { type: "edit", category } }),
  openDeleteDialog: (categories) => set({ dialog: { type: "delete", categories } }),
  closeDialog: () => set({ dialog: null }),
}));
