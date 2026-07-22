"use client";

import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { transactionFormMessages } from "@/modules/transactions/components/transaction-form.messages";
import { MONTH_LABELS } from "@/modules/transactions/types/transaction";

export interface ITransactionCategoryOption {
  id: string;
  name: string;
}

export const transactionFormSchema = z.object({
  description: z.string(),
  amount: z
    .string()
    .min(1, transactionFormMessages.validation.amount)
    .refine((value) => Number.isFinite(Number(value.replace(",", "."))), {
      message: transactionFormMessages.validation.amount,
    }),
  categoryId: z.string().min(1, transactionFormMessages.validation.category),
  transactionDate: z.iso.date(transactionFormMessages.validation.transactionDate),
  referenceMonth: z.string().min(1, transactionFormMessages.validation.referenceMonth),
  referenceYear: z
    .string()
    .min(1, transactionFormMessages.validation.referenceYear)
    .refine((value) => {
      const year = Number(value);
      return Number.isInteger(year) && year >= 1900 && year <= 2200;
    }, transactionFormMessages.validation.referenceYear),
});

export type ITransactionFormValues = z.infer<typeof transactionFormSchema>;

export function parseAmount(value: string): number {
  return Number(value.replace(",", "."));
}

export interface ITransactionFormProps {
  formId: string;
  form: UseFormReturn<ITransactionFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  categoryOptions: ITransactionCategoryOption[];
}

export function TransactionForm({
  formId,
  form,
  onSubmit,
  categoryOptions,
}: Readonly<ITransactionFormProps>) {
  return (
    <Form {...form}>
      <form id={formId} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{transactionFormMessages.amountLabel}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder={transactionFormMessages.amountPlaceholder}
                    className="font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="transactionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{transactionFormMessages.transactionDateLabel}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{transactionFormMessages.categoryLabel}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={transactionFormMessages.categoryPlaceholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="referenceMonth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{transactionFormMessages.referenceMonthLabel}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={transactionFormMessages.referenceMonthPlaceholder}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(MONTH_LABELS).map(([month, label]) => (
                      <SelectItem key={month} value={month}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referenceYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{transactionFormMessages.referenceYearLabel}</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="numeric" min={1900} max={2200} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{transactionFormMessages.descriptionLabel}</FormLabel>
              <FormControl>
                <Input
                  placeholder={transactionFormMessages.descriptionPlaceholder}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
