"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
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
import { loanFormSchema } from "@/modules/loans/components/loan-form";

export const loanBulkFormSchema = z.object({
  items: z.array(loanFormSchema).min(1),
});

export type ILoanBulkFormValues = z.infer<typeof loanBulkFormSchema>;

export function createEmptyLoanItem(): ILoanBulkFormValues["items"][number] {
  return {
    personName: "",
    description: "",
    loanDate: new Date().toISOString().slice(0, 10),
    amountLent: "",
  };
}

export interface ILoanBulkFormProps {
  formId: string;
  form: UseFormReturn<ILoanBulkFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function LoanBulkForm({ formId, form, onSubmit }: Readonly<ILoanBulkFormProps>) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <Form {...form}>
      <form id={formId} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {fields.map((fieldItem, index) => (
            <fieldset
              key={fieldItem.id}
              className="flex flex-col gap-4 rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <legend className="text-sm font-medium text-muted-foreground">
                  {loanFormMessages.rowLabel(index + 1)}
                </legend>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    aria-label={loanFormMessages.removeRow}
                  >
                    <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                  </Button>
                )}
              </div>
              <FormField
                control={form.control}
                name={`items.${index}.personName`}
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
                name={`items.${index}.description`}
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
                  name={`items.${index}.loanDate`}
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
                  name={`items.${index}.amountLent`}
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
            </fieldset>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => append(createEmptyLoanItem())}
          className="self-start"
        >
          <Plus className="size-4" aria-hidden="true" />
          {loanFormMessages.addRow}
        </Button>
      </form>
    </Form>
  );
}
