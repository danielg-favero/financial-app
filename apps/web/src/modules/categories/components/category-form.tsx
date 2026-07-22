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

import { categoryFormMessages } from "@/modules/categories/components/category-form.messages";
import {
  CATEGORY_TYPE_LABELS,
  CategoryType,
  EXPENSE_KIND_LABELS,
  ExpenseKind,
  type ICategory,
} from "@/modules/categories/types/category";

const NONE_VALUE = "none";

export const categoryFormSchema = z.object({
  name: z.string().min(1, categoryFormMessages.validation.name),
  type: z.enum(CategoryType, categoryFormMessages.validation.type),
  expenseKind: z.enum(ExpenseKind).nullable(),
  parentId: z.string().nullable(),
});

export type ICategoryFormValues = z.infer<typeof categoryFormSchema>;

export interface ICategoryFormProps {
  formId: string;
  form: UseFormReturn<ICategoryFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  parentOptions: ICategory[];
}

export function CategoryForm({
  formId,
  form,
  onSubmit,
  parentOptions,
}: Readonly<ICategoryFormProps>) {
  const selectedType = form.watch("type");

  return (
    <Form {...form}>
      <form id={formId} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{categoryFormMessages.nameLabel}</FormLabel>
              <FormControl>
                <Input placeholder={categoryFormMessages.namePlaceholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{categoryFormMessages.typeLabel}</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value !== CategoryType.DESPESA) {
                    form.setValue("expenseKind", null);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={categoryFormMessages.typePlaceholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(CategoryType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {CATEGORY_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedType === CategoryType.DESPESA && (
          <FormField
            control={form.control}
            name="expenseKind"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{categoryFormMessages.expenseKindLabel}</FormLabel>
                <Select
                  value={field.value ?? NONE_VALUE}
                  onValueChange={(value) => {
                    field.onChange(value === NONE_VALUE ? null : value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={categoryFormMessages.expenseKindPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE}>
                      {categoryFormMessages.expenseKindNone}
                    </SelectItem>
                    {Object.values(ExpenseKind).map((kind) => (
                      <SelectItem key={kind} value={kind}>
                        {EXPENSE_KIND_LABELS[kind]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{categoryFormMessages.parentLabel}</FormLabel>
              <Select
                value={field.value ?? NONE_VALUE}
                onValueChange={(value) => {
                  field.onChange(value === NONE_VALUE ? null : value);
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={categoryFormMessages.parentPlaceholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>{categoryFormMessages.parentNone}</SelectItem>
                  {parentOptions.map((category) => (
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
      </form>
    </Form>
  );
}
