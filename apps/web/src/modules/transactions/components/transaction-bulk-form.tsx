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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { transactionFormMessages } from "@/modules/transactions/components/transaction-form.messages";
import {
  transactionFormSchema,
  type ITransactionCategoryOption,
} from "@/modules/transactions/components/transaction-form";
import { MONTH_LABELS } from "@/modules/transactions/types/transaction";

export const transactionBulkFormSchema = z.object({
  items: z.array(transactionFormSchema).min(1),
});

export type ITransactionBulkFormValues = z.infer<typeof transactionBulkFormSchema>;

export function createEmptyTransactionItem(): ITransactionBulkFormValues["items"][number] {
  const today = new Date();
  return {
    description: "",
    amount: "",
    categoryId: "",
    transactionDate: today.toISOString().slice(0, 10),
    referenceMonth: String(today.getMonth() + 1),
    referenceYear: String(today.getFullYear()),
  };
}

export interface ITransactionBulkFormProps {
  formId: string;
  form: UseFormReturn<ITransactionBulkFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  categoryOptions: ITransactionCategoryOption[];
}

export function TransactionBulkForm({
  formId,
  form,
  onSubmit,
  categoryOptions,
}: Readonly<ITransactionBulkFormProps>) {
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
                  {transactionFormMessages.rowLabel(index + 1)}
                </legend>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    aria-label={transactionFormMessages.removeRow}
                  >
                    <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                  </Button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.amount`}
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
                  name={`items.${index}.transactionDate`}
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
                name={`items.${index}.categoryId`}
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
                  name={`items.${index}.referenceMonth`}
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
                  name={`items.${index}.referenceYear`}
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
                name={`items.${index}.description`}
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
            </fieldset>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => append(createEmptyTransactionItem())}
          className="self-start"
        >
          <Plus className="size-4" aria-hidden="true" />
          {transactionFormMessages.addRow}
        </Button>
      </form>
    </Form>
  );
}
