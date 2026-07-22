"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

export interface ISearchInputProps {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  "aria-label"?: string;
  className?: string;
}

const DEFAULT_DEBOUNCE_MS = 400;

export function SearchInput({
  value,
  onChange,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  placeholder,
  className,
  "aria-label": ariaLabel,
}: Readonly<ISearchInputProps>) {
  const [internalValue, setInternalValue] = useState(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Keep the input in sync when the committed value changes from the outside
  // (e.g. a programmatic reset), without fighting the debounced local state.
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounce propagation to the parent so we don't hit the endpoint on every keystroke.
  useEffect(() => {
    if (internalValue === value) {
      return;
    }
    const timeout = setTimeout(
      () => onChangeRef.current(internalValue),
      debounceMs,
    );
    return () => clearTimeout(timeout);
  }, [internalValue, value, debounceMs]);

  return (
    <div className={cn("relative w-full", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={internalValue}
        onChange={(event) => setInternalValue(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pl-9"
      />
    </div>
  );
}
