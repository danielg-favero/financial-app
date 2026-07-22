"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const PER_PAGE_OPTIONS = [10, 20, 50] as const;

export interface IAppPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function AppPagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
  onPerPageChange,
}: Readonly<IAppPaginationProps>) {
  const handlePerPageChange = (value: string) => {
    onPerPageChange(Number(value));
  };

  const goToPreviousPage = () => {
    onPageChange(page - 1);
  };

  const goToNextPage = () => {
    onPageChange(page + 1);
  };

  return (
    <nav
      aria-label="Paginação"
      className="flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {total} {total === 1 ? "registro" : "registros"}
      </p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Por página</span>
          <Select value={String(perPage)} onValueChange={handlePerPageChange}>
            <SelectTrigger size="sm" aria-label="Itens por página">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousPage}
            disabled={page <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <span className="text-sm whitespace-nowrap">
            Página {page} de {Math.max(totalPages, 1)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextPage}
            disabled={page >= totalPages}
            aria-label="Próxima página"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
