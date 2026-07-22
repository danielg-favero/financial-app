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

import { loanFormMessages } from "@/modules/loans/components/loan-form.messages";

export function parseMoney(value: string): number {
  return Number(value.replace(",", "."));
}

export const loanFormSchema = z.object({
  personName: z.string().min(1, loanFormMessages.validation.personName),
  description: z.string().min(1, loanFormMessages.validation.description),
  loanDate: z.iso.date(loanFormMessages.validation.loanDate),
  amountLent: z
    .string()
    .min(1, loanFormMessages.validation.amountLent)
    .refine((value) => {
      const amount = parseMoney(value);
      return Number.isFinite(amount) && amount > 0;
    }, loanFormMessages.validation.amountLent),
});

export type ILoanFormValues = z.infer<typeof loanFormSchema>;

export interface ILoanFormProps {
  formId: string;
  form: UseFormReturn<ILoanFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function LoanForm({ formId, form, onSubmit }: Readonly<ILoanFormProps>) {
  return (
    <Form {...form}>
      <form id={formId} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="personName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{loanFormMessages.personNameLabel}</FormLabel>
              <FormControl>
                <Input placeholder={loanFormMessages.personNamePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{loanFormMessages.descriptionLabel}</FormLabel>
              <FormControl>
                <Input placeholder={loanFormMessages.descriptionPlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="loanDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{loanFormMessages.loanDateLabel}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amountLent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{loanFormMessages.amountLentLabel}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder={loanFormMessages.amountLentPlaceholder}
                    className="font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
