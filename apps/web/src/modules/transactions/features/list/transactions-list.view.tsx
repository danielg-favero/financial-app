import { Pencil, Plus, Trash2 } from "lucide-react";

import { AppPagination } from "@/shared/components/app-pagination";
import { SearchInput } from "@/shared/components/search-input";
import { SortableColumnButton } from "@/shared/components/sortable-column-button";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatCurrency, formatDate } from "@/shared/lib/formatters";

import {
  CATEGORY_TYPE_LABELS,
  CategoryType,
  EXPENSE_KIND_LABELS,
  ExpenseKind,
} from "@/modules/categories";
import type { ITransactionCategoryOption } from "@/modules/transactions/components/transaction-form";
import { transactionsListMessages } from "@/modules/transactions/features/list/transactions-list.messages";
import type { ITransactionsListModel } from "@/modules/transactions/features/list/transactions-list.model";
import { MONTH_LABELS } from "@/modules/transactions/types/transaction";

const ALL_VALUE = "all";
const COLUMN_COUNT = 9;
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: 8 },
  (_, index) => CURRENT_YEAR + 1 - index,
);

const TYPE_BADGE_VARIANTS: Record<
  CategoryType,
  "default" | "secondary" | "destructive"
> = {
  RECEITA: "default",
  INVESTIMENTO: "secondary",
  DESPESA: "destructive",
};

export interface ITransactionsListViewProps extends ITransactionsListModel {
  categoryOptions: ITransactionCategoryOption[];
}

export function TransactionsListView({
  transactions,
  categoryOptions,
  isLoading,
  isError,
  page,
  perPage,
  total,
  totalPages,
  search,
  orderBy,
  sort,
  filters,
  selectedIds,
  selectedCount,
  allSelected,
  someSelected,
  onPageChange,
  onPerPageChange,
  onSearchChange,
  onToggleOrderBy,
  onFiltersChange,
  onToggleSelect,
  onToggleSelectAll,
  onCreate,
  onEdit,
  onDelete,
  onDeleteSelected,
}: Readonly<ITransactionsListViewProps>) {
  const selectedIdSet = new Set(selectedIds);

  return (
    <section className="flex flex-col gap-4" aria-label="Transações">
      <div className="flex flex-col gap-3">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={transactionsListMessages.searchPlaceholder}
          aria-label={transactionsListMessages.searchLabel}
        />
        <div className="flex items-center gap-3 flex-col lg:flex-row">
          <div className="flex w-full lg:min-w-0 lg:flex-1 items-center gap-3 flex-col lg:flex-row">
            <Select
              value={filters.categoryId ?? ALL_VALUE}
              onValueChange={(value) => {
                onFiltersChange({
                  categoryId: value === ALL_VALUE ? undefined : value,
                });
              }}
            >
              <SelectTrigger
                className="w-full lg:min-w-0 lg:flex-1"
                aria-label={transactionsListMessages.categoryFilterLabel}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>
                  {transactionsListMessages.categoryFilterAll}
                </SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.categoryType ?? ALL_VALUE}
              onValueChange={(value) => {
                onFiltersChange({
                  categoryType:
                    value === ALL_VALUE ? undefined : (value as CategoryType),
                });
              }}
            >
              <SelectTrigger
                className="w-full lg:min-w-0 lg:flex-1"
                aria-label={transactionsListMessages.categoryTypeFilterLabel}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>
                  {transactionsListMessages.categoryTypeFilterAll}
                </SelectItem>
                {Object.entries(CATEGORY_TYPE_LABELS).map(([type, label]) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.expenseKind ?? ALL_VALUE}
              onValueChange={(value) => {
                onFiltersChange({
                  expenseKind:
                    value === ALL_VALUE ? undefined : (value as ExpenseKind),
                });
              }}
            >
              <SelectTrigger
                className="w-full lg:min-w-0 lg:flex-1"
                aria-label={transactionsListMessages.expenseKindFilterLabel}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>
                  {transactionsListMessages.expenseKindFilterAll}
                </SelectItem>
                {Object.entries(EXPENSE_KIND_LABELS).map(([kind, label]) => (
                  <SelectItem key={kind} value={kind}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={
                filters.referenceMonth
                  ? String(filters.referenceMonth)
                  : ALL_VALUE
              }
              onValueChange={(value) => {
                onFiltersChange({
                  referenceMonth:
                    value === ALL_VALUE ? undefined : Number(value),
                });
              }}
            >
              <SelectTrigger
                className="w-full lg:min-w-0 lg:flex-1"
                aria-label={transactionsListMessages.monthFilterLabel}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>
                  {transactionsListMessages.monthFilterAll}
                </SelectItem>
                {Object.entries(MONTH_LABELS).map(([month, label]) => (
                  <SelectItem key={month} value={month}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={
                filters.referenceYear
                  ? String(filters.referenceYear)
                  : ALL_VALUE
              }
              onValueChange={(value) => {
                onFiltersChange({
                  referenceYear:
                    value === ALL_VALUE ? undefined : Number(value),
                });
              }}
            >
              <SelectTrigger
                className="w-full lg:min-w-0 lg:flex-1"
                aria-label={transactionsListMessages.yearFilterLabel}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>
                  {transactionsListMessages.yearFilterAll}
                </SelectItem>
                {YEAR_OPTIONS.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-full lg:w-auto lg:flex-row flex-col-reverse gap-2">
            {selectedCount > 0 && (
              <Button
                variant="destructive"
                onClick={onDeleteSelected}
                className="w-full lg:min-w-0 lg:flex-1"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                {transactionsListMessages.deleteSelected(selectedCount)}
              </Button>
            )}
            <Button onClick={onCreate} className="w-full lg:min-w-0 lg:flex-1">
              <Plus className="size-4" aria-hidden="true" />
              {transactionsListMessages.newTransaction}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    allSelected ? true : someSelected ? "indeterminate" : false
                  }
                  onCheckedChange={onToggleSelectAll}
                  aria-label={transactionsListMessages.selectAll}
                />
              </TableHead>
              <TableHead>{transactionsListMessages.columns.category}</TableHead>
              <TableHead>
                {transactionsListMessages.columns.categoryType}
              </TableHead>
              <TableHead>
                {transactionsListMessages.columns.expenseKind}
              </TableHead>
              <TableHead
                className="text-right"
                aria-sort={
                  orderBy === "amount"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={transactionsListMessages.columns.amount}
                  isActive={orderBy === "amount"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("amount")}
                />
              </TableHead>
              <TableHead
                aria-sort={
                  orderBy === "transactionDate"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={transactionsListMessages.columns.transactionDate}
                  isActive={orderBy === "transactionDate"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("transactionDate")}
                />
              </TableHead>
              <TableHead
                aria-sort={
                  orderBy === "referenceMonth"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={transactionsListMessages.columns.reference}
                  isActive={orderBy === "referenceMonth"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("referenceMonth")}
                />
              </TableHead>
              <TableHead
                aria-sort={
                  orderBy === "description"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={transactionsListMessages.columns.description}
                  isActive={orderBy === "description"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("description")}
                />
              </TableHead>
              <TableHead className="text-right">
                {transactionsListMessages.columns.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }, (_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={COLUMN_COUNT}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading && isError && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="text-center text-muted-foreground"
                >
                  {transactionsListMessages.error}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && transactions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="text-center text-muted-foreground"
                >
                  {transactionsListMessages.empty}
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              !isError &&
              transactions.map((transaction) => {
                const description =
                  transaction.description ?? transactionsListMessages.none;
                return (
                  <TableRow
                    key={transaction.id}
                    data-state={
                      selectedIdSet.has(transaction.id) ? "selected" : undefined
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedIdSet.has(transaction.id)}
                        onCheckedChange={() => onToggleSelect(transaction.id)}
                        aria-label={transactionsListMessages.selectRow(
                          description,
                        )}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.category.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={TYPE_BADGE_VARIANTS[transaction.category.type]}
                      >
                        {CATEGORY_TYPE_LABELS[transaction.category.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.category.expenseKind
                        ? EXPENSE_KIND_LABELS[transaction.category.expenseKind]
                        : transactionsListMessages.none}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {formatDate(transaction.transactionDate)}
                    </TableCell>
                    <TableCell>
                      {MONTH_LABELS[transaction.referenceMonth]}/
                      {transaction.referenceYear}
                    </TableCell>
                    <TableCell className="font-medium">{description}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(transaction)}
                          aria-label={transactionsListMessages.edit(
                            description,
                          )}
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(transaction)}
                          aria-label={transactionsListMessages.remove(
                            description,
                          )}
                        >
                          <Trash2
                            className="size-4 text-destructive"
                            aria-hidden="true"
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <AppPagination
        page={page}
        totalPages={totalPages}
        total={total}
        perPage={perPage}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
      />
    </section>
  );
}
