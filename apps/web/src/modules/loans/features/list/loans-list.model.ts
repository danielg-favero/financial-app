import type { SortDirection } from "@/shared/infra/http/list";

import { useGetLoans } from "@/modules/loans/api/queries/useGetLoans";
import type { ListLoansService } from "@/modules/loans/api/services/list-loans.service";
import { useLoansStore } from "@/modules/loans/store";
import type { ILoan, LoanOrderByField } from "@/modules/loans/types/loan";

export interface ILoansListModel {
  loans: ILoan[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  search: string;
  orderBy?: LoanOrderByField;
  sort: SortDirection;
  selectedIds: string[];
  selectedCount: number;
  allSelected: boolean;
  someSelected: boolean;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  onSearchChange: (search: string) => void;
  onToggleOrderBy: (field: LoanOrderByField) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onCreate: () => void;
  onEdit: (loan: ILoan) => void;
  onDelete: (loan: ILoan) => void;
  onDeleteSelected: () => void;
  onRegisterPayment: (loan: ILoan) => void;
}

interface ILoansListModelParams {
  listLoansService: ListLoansService;
}

export function useLoansListModel({
  listLoansService,
}: ILoansListModelParams): ILoansListModel {
  const store = useLoansStore();

  const loansQuery = useGetLoans({
    listLoansService,
    params: {
      page: store.page,
      perPage: store.perPage,
      search: store.search || undefined,
      orderBy: store.orderBy,
      sort: store.sort,
    },
  });

  const loans = loansQuery.data?.data ?? [];
  const selectedIdSet = new Set(store.selectedIds);
  const allSelected = loans.length > 0 && loans.every((loan) => selectedIdSet.has(loan.id));
  const someSelected = store.selectedIds.length > 0 && !allSelected;

  const onToggleSelectAll = () => {
    store.setSelected(allSelected ? [] : loans.map((loan) => loan.id));
  };

  const onDeleteSelected = () => {
    const selected = loans.filter((loan) => selectedIdSet.has(loan.id));
    if (selected.length > 0) {
      store.openDeleteDialog(selected);
    }
  };

  return {
    loans,
    isLoading: loansQuery.isPending,
    isError: loansQuery.isError,
    page: store.page,
    perPage: store.perPage,
    total: loansQuery.data?.total ?? 0,
    totalPages: loansQuery.data?.totalPages ?? 0,
    search: store.search,
    orderBy: store.orderBy,
    sort: store.sort,
    selectedIds: store.selectedIds,
    selectedCount: store.selectedIds.length,
    allSelected,
    someSelected,
    onPageChange: store.setPage,
    onPerPageChange: store.setPerPage,
    onSearchChange: store.setSearch,
    onToggleOrderBy: store.toggleOrderBy,
    onToggleSelect: store.toggleSelected,
    onToggleSelectAll,
    onCreate: store.openCreateDialog,
    onEdit: store.openEditDialog,
    onDelete: (loan) => store.openDeleteDialog([loan]),
    onDeleteSelected,
    onRegisterPayment: store.openPaymentDialog,
  };
}
