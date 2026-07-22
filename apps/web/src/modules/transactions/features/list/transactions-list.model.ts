import type { SortDirection } from "@/shared/infra/http/list";

import { useGetTransactions } from "@/modules/transactions/api/queries/useGetTransactions";
import type { ListTransactionsService } from "@/modules/transactions/api/services/list-transactions.service";
import { useTransactionsStore } from "@/modules/transactions/store";
import type {
  ITransaction,
  ITransactionFilters,
  TransactionOrderByField,
} from "@/modules/transactions/types/transaction";

export interface ITransactionsListModel {
  transactions: ITransaction[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  search: string;
  orderBy?: TransactionOrderByField;
  sort: SortDirection;
  filters: ITransactionFilters;
  selectedIds: string[];
  selectedCount: number;
  allSelected: boolean;
  someSelected: boolean;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  onSearchChange: (search: string) => void;
  onToggleOrderBy: (field: TransactionOrderByField) => void;
  onFiltersChange: (filters: Partial<ITransactionFilters>) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onCreate: () => void;
  onEdit: (transaction: ITransaction) => void;
  onDelete: (transaction: ITransaction) => void;
  onDeleteSelected: () => void;
}

interface ITransactionsListModelParams {
  listTransactionsService: ListTransactionsService;
}

export function useTransactionsListModel({
  listTransactionsService,
}: ITransactionsListModelParams): ITransactionsListModel {
  const store = useTransactionsStore();

  const hasFilters = Object.values(store.filters).some((value) => value !== undefined);
  const transactionsQuery = useGetTransactions({
    listTransactionsService,
    params: {
      page: store.page,
      perPage: store.perPage,
      search: store.search || undefined,
      orderBy: store.orderBy,
      sort: store.sort,
      filters: hasFilters ? store.filters : undefined,
    },
  });

  const transactions = transactionsQuery.data?.data ?? [];
  const selectedIdSet = new Set(store.selectedIds);
  const allSelected =
    transactions.length > 0 && transactions.every((transaction) => selectedIdSet.has(transaction.id));
  const someSelected = store.selectedIds.length > 0 && !allSelected;

  const onToggleSelectAll = () => {
    store.setSelected(allSelected ? [] : transactions.map((transaction) => transaction.id));
  };

  const onDeleteSelected = () => {
    const selected = transactions.filter((transaction) => selectedIdSet.has(transaction.id));
    if (selected.length > 0) {
      store.openDeleteDialog(selected);
    }
  };

  return {
    transactions,
    isLoading: transactionsQuery.isPending,
    isError: transactionsQuery.isError,
    page: store.page,
    perPage: store.perPage,
    total: transactionsQuery.data?.total ?? 0,
    totalPages: transactionsQuery.data?.totalPages ?? 0,
    search: store.search,
    orderBy: store.orderBy,
    sort: store.sort,
    filters: store.filters,
    selectedIds: store.selectedIds,
    selectedCount: store.selectedIds.length,
    allSelected,
    someSelected,
    onPageChange: store.setPage,
    onPerPageChange: store.setPerPage,
    onSearchChange: store.setSearch,
    onToggleOrderBy: store.toggleOrderBy,
    onFiltersChange: store.setFilters,
    onToggleSelect: store.toggleSelected,
    onToggleSelectAll,
    onCreate: store.openCreateDialog,
    onEdit: store.openEditDialog,
    onDelete: (transaction) => store.openDeleteDialog([transaction]),
    onDeleteSelected,
  };
}
