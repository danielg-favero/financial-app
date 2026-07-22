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

import { categoryFormMessages } from "@/modules/categories/components/category-form.messages";
import { categoryFormSchema } from "@/modules/categories/components/category-form";
import {
  CATEGORY_TYPE_LABELS,
  CategoryType,
  EXPENSE_KIND_LABELS,
  ExpenseKind,
  type ICategory,
} from "@/modules/categories/types/category";

const NONE_VALUE = "none";

export const categoryBulkFormSchema = z.object({
  items: z.array(categoryFormSchema).min(1),
});

export type ICategoryBulkFormValues = z.infer<typeof categoryBulkFormSchema>;

export const emptyCategoryItem: ICategoryBulkFormValues["items"][number] = {
  name: "",
  type: CategoryType.DESPESA,
  expenseKind: null,
  parentId: null,
};

export interface ICategoryBulkFormProps {
  formId: string;
  form: UseFormReturn<ICategoryBulkFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  parentOptions: ICategory[];
}

export function CategoryBulkForm({
  formId,
  form,
  onSubmit,
  parentOptions,
}: Readonly<ICategoryBulkFormProps>) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <Form {...form}>
      <form id={formId} onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {fields.map((fieldItem, index) => {
            const selectedType = form.watch(`items.${index}.type`);

            return (
              <fieldset
                key={fieldItem.id}
                className="flex flex-col gap-4 rounded-lg border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <legend className="text-sm font-medium text-muted-foreground">
                    {categoryFormMessages.rowLabel(index + 1)}
                  </legend>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      aria-label={categoryFormMessages.removeRow}
                    >
                      <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                    </Button>
                  )}
                </div>
                <FormField
                  control={form.control}
                  name={`items.${index}.name`}
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
                  name={`items.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{categoryFormMessages.typeLabel}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value !== CategoryType.DESPESA) {
                            form.setValue(`items.${index}.expenseKind`, null);
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
                    name={`items.${index}.expenseKind`}
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
                  name={`items.${index}.parentId`}
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
              </fieldset>
            );
          })}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => append(emptyCategoryItem)}
          className="self-start"
        >
          <Plus className="size-4" aria-hidden="true" />
          {categoryFormMessages.addRow}
        </Button>
      </form>
    </Form>
  );
}
