import { useMemo } from "react";

import type { SortDirection } from "@/shared/infra/http/list";

import { useGetCategories } from "@/modules/categories/api/queries/useGetCategories";
import { useGetCategoriesForSelect } from "@/modules/categories/api/queries/useGetCategoriesForSelect";
import type { ListCategoriesForSelectService } from "@/modules/categories/api/services/list-categories-for-select.service";
import type { ListCategoriesService } from "@/modules/categories/api/services/list-categories.service";
import { useCategoriesStore } from "@/modules/categories/store";
import type { CategoryOrderByField, ICategory } from "@/modules/categories/types/category";

export interface ICategoriesListModel {
  categories: ICategory[];
  parentNameById: Map<string, string>;
  parentOptions: ICategory[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  search: string;
  orderBy?: CategoryOrderByField;
  sort: SortDirection;
  parentId?: string;
  selectedIds: string[];
  selectedCount: number;
  allSelected: boolean;
  someSelected: boolean;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  onSearchChange: (search: string) => void;
  onToggleOrderBy: (field: CategoryOrderByField) => void;
  onParentFilterChange: (parentId?: string) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onCreate: () => void;
  onEdit: (category: ICategory) => void;
  onDelete: (category: ICategory) => void;
  onDeleteSelected: () => void;
}

interface ICategoriesListModelParams {
  listCategoriesService: ListCategoriesService;
  listCategoriesForSelectService: ListCategoriesForSelectService;
}

export function useCategoriesListModel({
  listCategoriesService,
  listCategoriesForSelectService,
}: ICategoriesListModelParams): ICategoriesListModel {
  const store = useCategoriesStore();

  const categoriesQuery = useGetCategories({
    listCategoriesService,
    params: {
      page: store.page,
      perPage: store.perPage,
      search: store.search || undefined,
      orderBy: store.orderBy,
      sort: store.sort,
      filters: store.parentId ? { parentId: store.parentId } : undefined,
    },
  });
  const parentOptionsQuery = useGetCategoriesForSelect({ listCategoriesForSelectService });

  const categories = categoriesQuery.data?.data ?? [];

  const parentNameById = useMemo(
    () => new Map((parentOptionsQuery.data ?? []).map((category) => [category.id, category.name])),
    [parentOptionsQuery.data],
  );

  const selectedIdSet = useMemo(() => new Set(store.selectedIds), [store.selectedIds]);
  const allSelected = categories.length > 0 && categories.every((category) => selectedIdSet.has(category.id));
  const someSelected = store.selectedIds.length > 0 && !allSelected;

  const onToggleSelectAll = () => {
    store.setSelected(allSelected ? [] : categories.map((category) => category.id));
  };

  const onDeleteSelected = () => {
    const selected = categories.filter((category) => selectedIdSet.has(category.id));
    if (selected.length > 0) {
      store.openDeleteDialog(selected);
    }
  };

  return {
    categories,
    parentNameById,
    parentOptions: parentOptionsQuery.data ?? [],
    isLoading: categoriesQuery.isPending,
    isError: categoriesQuery.isError,
    page: store.page,
    perPage: store.perPage,
    total: categoriesQuery.data?.total ?? 0,
    totalPages: categoriesQuery.data?.totalPages ?? 0,
    search: store.search,
    orderBy: store.orderBy,
    sort: store.sort,
    parentId: store.parentId,
    selectedIds: store.selectedIds,
    selectedCount: store.selectedIds.length,
    allSelected,
    someSelected,
    onPageChange: store.setPage,
    onPerPageChange: store.setPerPage,
    onSearchChange: store.setSearch,
    onToggleOrderBy: store.toggleOrderBy,
    onParentFilterChange: store.setParentFilter,
    onToggleSelect: store.toggleSelected,
    onToggleSelectAll,
    onCreate: store.openCreateDialog,
    onEdit: store.openEditDialog,
    onDelete: (category) => store.openDeleteDialog([category]),
    onDeleteSelected,
  };
}
