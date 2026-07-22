"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import type { SortDirection } from "@/shared/infra/http/list";

export interface ISortableColumnButtonProps {
  label: string;
  isActive: boolean;
  direction: SortDirection;
  onSort: () => void;
}

export function SortableColumnButton({
  label,
  isActive,
  direction,
  onSort,
}: Readonly<ISortableColumnButtonProps>) {
  const Icon = isActive ? (direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onSort}
      className="-ml-3 gap-1.5"
      aria-label={`Ordenar por ${label}`}
    >
      {label}
      <Icon className="size-3.5" aria-hidden="true" />
    </Button>
  );
}
