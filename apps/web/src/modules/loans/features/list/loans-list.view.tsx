import { HandCoins, Pencil, Plus, Trash2 } from "lucide-react";

import { AppPagination } from "@/shared/components/app-pagination";
import { SearchInput } from "@/shared/components/search-input";
import { SortableColumnButton } from "@/shared/components/sortable-column-button";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
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

import { loansListMessages } from "@/modules/loans/features/list/loans-list.messages";
import type { ILoansListModel } from "@/modules/loans/features/list/loans-list.model";

const COLUMN_COUNT = 9;

export function LoansListView({
  loans,
  isLoading,
  isError,
  page,
  perPage,
  total,
  totalPages,
  search,
  orderBy,
  sort,
  selectedIds,
  selectedCount,
  allSelected,
  someSelected,
  onPageChange,
  onPerPageChange,
  onSearchChange,
  onToggleOrderBy,
  onToggleSelect,
  onToggleSelectAll,
  onCreate,
  onEdit,
  onDelete,
  onDeleteSelected,
  onRegisterPayment,
}: Readonly<ILoansListModel>) {
  const selectedIdSet = new Set(selectedIds);

  return (
    <section className="flex flex-col gap-4" aria-label="Empréstimos">
      <div className="flex flex-col gap-3">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={loansListMessages.searchPlaceholder}
          aria-label={loansListMessages.searchLabel}
        />
        <div className="flex w-full lg:w-auto lg:flex-row justify-end flex-col-reverse gap-2">
          {selectedCount > 0 && (
            <Button variant="destructive" onClick={onDeleteSelected}>
              <Trash2 className="size-4" aria-hidden="true" />
              {loansListMessages.deleteSelected(selectedCount)}
            </Button>
          )}
          <Button onClick={onCreate}>
            <Plus className="size-4" aria-hidden="true" />
            {loansListMessages.newLoan}
          </Button>
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
                  aria-label={loansListMessages.selectAll}
                />
              </TableHead>
              <TableHead
                aria-sort={
                  orderBy === "personName"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={loansListMessages.columns.personName}
                  isActive={orderBy === "personName"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("personName")}
                />
              </TableHead>
              <TableHead>{loansListMessages.columns.description}</TableHead>
              <TableHead
                aria-sort={
                  orderBy === "loanDate"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={loansListMessages.columns.loanDate}
                  isActive={orderBy === "loanDate"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("loanDate")}
                />
              </TableHead>
              <TableHead
                className="text-right"
                aria-sort={
                  orderBy === "amountLent"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={loansListMessages.columns.amountLent}
                  isActive={orderBy === "amountLent"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("amountLent")}
                />
              </TableHead>
              <TableHead className="text-right">
                {loansListMessages.columns.amountReceived}
              </TableHead>
              <TableHead
                className="text-right"
                aria-sort={
                  orderBy === "openBalance"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={loansListMessages.columns.openBalance}
                  isActive={orderBy === "openBalance"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("openBalance")}
                />
              </TableHead>
              <TableHead
                aria-sort={
                  orderBy === "isPaid"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={loansListMessages.columns.status}
                  isActive={orderBy === "isPaid"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("isPaid")}
                />
              </TableHead>
              <TableHead className="text-right">
                {loansListMessages.columns.actions}
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
                  {loansListMessages.error}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && loans.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="text-center text-muted-foreground"
                >
                  {loansListMessages.empty}
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              !isError &&
              loans.map((loan) => (
                <TableRow
                  key={loan.id}
                  data-state={
                    selectedIdSet.has(loan.id) ? "selected" : undefined
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIdSet.has(loan.id)}
                      onCheckedChange={() => onToggleSelect(loan.id)}
                      aria-label={loansListMessages.selectRow(loan.personName)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {loan.personName}
                  </TableCell>
                  <TableCell>{loan.description}</TableCell>
                  <TableCell>{formatDate(loan.loanDate)}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(loan.amountLent)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(loan.amountReceived)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(loan.openBalance)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={loan.isPaid ? "default" : "secondary"}>
                      {loan.isPaid
                        ? loansListMessages.statusPaid
                        : loansListMessages.statusOpen}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRegisterPayment(loan)}
                        disabled={loan.isPaid}
                        aria-label={loansListMessages.registerPayment(
                          loan.personName,
                        )}
                      >
                        <HandCoins
                          className="size-4 text-primary-strong"
                          aria-hidden="true"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(loan)}
                        aria-label={loansListMessages.edit(loan.personName)}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(loan)}
                        aria-label={loansListMessages.remove(loan.personName)}
                      >
                        <Trash2
                          className="size-4 text-destructive"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
