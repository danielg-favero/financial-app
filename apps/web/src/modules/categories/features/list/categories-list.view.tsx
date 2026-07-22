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
import { formatDate } from "@/shared/lib/formatters";

import { categoriesListMessages } from "@/modules/categories/features/list/categories-list.messages";
import type { ICategoriesListModel } from "@/modules/categories/features/list/categories-list.model";
import {
  CATEGORY_TYPE_LABELS,
  EXPENSE_KIND_LABELS,
  type CategoryType,
} from "@/modules/categories/types/category";

const ALL_VALUE = "all";
const COLUMN_COUNT = 7;

const TYPE_BADGE_VARIANTS: Record<
  CategoryType,
  "default" | "secondary" | "destructive"
> = {
  RECEITA: "default",
  INVESTIMENTO: "secondary",
  DESPESA: "destructive",
};

export function CategoriesListView({
  categories,
  parentNameById,
  parentOptions,
  isLoading,
  isError,
  page,
  perPage,
  total,
  totalPages,
  search,
  orderBy,
  sort,
  parentId,
  selectedIds,
  selectedCount,
  allSelected,
  someSelected,
  onPageChange,
  onPerPageChange,
  onSearchChange,
  onToggleOrderBy,
  onParentFilterChange,
  onToggleSelect,
  onToggleSelectAll,
  onCreate,
  onEdit,
  onDelete,
  onDeleteSelected,
}: Readonly<ICategoriesListModel>) {
  const selectedIdSet = new Set(selectedIds);
  return (
    <section className="flex flex-col gap-4" aria-label="Categorias">
      <div className="flex flex-col gap-3">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={categoriesListMessages.searchPlaceholder}
          aria-label={categoriesListMessages.searchLabel}
        />
        <div className="flex items-center gap-3 flex-col lg:flex-row">
          <div className="flex w-full lg:min-w-0 lg:flex-1 items-center gap-3">
            <Select
              value={parentId ?? ALL_VALUE}
              onValueChange={(value) => {
                onParentFilterChange(value === ALL_VALUE ? undefined : value);
              }}
            >
              <SelectTrigger
                className="w-full lg:min-w-0 lg:flex-1"
                aria-label={categoriesListMessages.parentFilterLabel}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>
                  {categoriesListMessages.parentFilterAll}
                </SelectItem>
                {parentOptions.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
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
                {categoriesListMessages.deleteSelected(selectedCount)}
              </Button>
            )}
            <Button onClick={onCreate} className="w-full lg:min-w-0 lg:flex-1">
              <Plus className="size-4" aria-hidden="true" />
              {categoriesListMessages.newCategory}
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
                  aria-label={categoriesListMessages.selectAll}
                />
              </TableHead>
              <TableHead
                aria-sort={
                  orderBy === "name"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={categoriesListMessages.columns.name}
                  isActive={orderBy === "name"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("name")}
                />
              </TableHead>
              <TableHead
                aria-sort={
                  orderBy === "type"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={categoriesListMessages.columns.type}
                  isActive={orderBy === "type"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("type")}
                />
              </TableHead>
              <TableHead>
                {categoriesListMessages.columns.expenseKind}
              </TableHead>
              <TableHead>{categoriesListMessages.columns.parent}</TableHead>
              <TableHead
                aria-sort={
                  orderBy === "createdAt"
                    ? sort === "asc"
                      ? "ascending"
                      : "descending"
                    : undefined
                }
              >
                <SortableColumnButton
                  label={categoriesListMessages.columns.createdAt}
                  isActive={orderBy === "createdAt"}
                  direction={sort}
                  onSort={() => onToggleOrderBy("createdAt")}
                />
              </TableHead>
              <TableHead className="text-right">
                {categoriesListMessages.columns.actions}
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
                  {categoriesListMessages.error}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && categories.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="text-center text-muted-foreground"
                >
                  {categoriesListMessages.empty}
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              !isError &&
              categories.map((category) => (
                <TableRow
                  key={category.id}
                  data-state={
                    selectedIdSet.has(category.id) ? "selected" : undefined
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIdSet.has(category.id)}
                      onCheckedChange={() => onToggleSelect(category.id)}
                      aria-label={categoriesListMessages.selectRow(
                        category.name,
                      )}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant={TYPE_BADGE_VARIANTS[category.type]}>
                      {CATEGORY_TYPE_LABELS[category.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {category.expenseKind
                      ? EXPENSE_KIND_LABELS[category.expenseKind]
                      : categoriesListMessages.none}
                  </TableCell>
                  <TableCell>
                    {category.parentId
                      ? (parentNameById.get(category.parentId) ??
                        categoriesListMessages.none)
                      : categoriesListMessages.none}
                  </TableCell>
                  <TableCell>{formatDate(category.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(category)}
                        aria-label={categoriesListMessages.edit(category.name)}
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(category)}
                        aria-label={categoriesListMessages.remove(
                          category.name,
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
