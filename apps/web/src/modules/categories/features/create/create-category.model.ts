import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

import { useCreateCategory } from "@/modules/categories/api/mutations/useCreateCategory";
import { useGetCategoriesForSelect } from "@/modules/categories/api/queries/useGetCategoriesForSelect";
import type { CreateCategoryService } from "@/modules/categories/api/services/create-category.service";
import type { ListCategoriesForSelectService } from "@/modules/categories/api/services/list-categories-for-select.service";
import {
  categoryBulkFormSchema,
  emptyCategoryItem,
  type ICategoryBulkFormValues,
} from "@/modules/categories/components/category-bulk-form";
import { createCategoryMessages } from "@/modules/categories/features/create/create-category.messages";
import { useCategoriesStore } from "@/modules/categories/store";
import { CategoryType, type ICategory } from "@/modules/categories/types/category";

export interface ICreateCategoryModel {
  form: UseFormReturn<ICategoryBulkFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isSubmitting: boolean;
  parentOptions: ICategory[];
}

interface ICreateCategoryModelParams {
  createCategoryService: CreateCategoryService;
  listCategoriesForSelectService: ListCategoriesForSelectService;
}

export function useCreateCategoryModel({
  createCategoryService,
  listCategoriesForSelectService,
}: ICreateCategoryModelParams): ICreateCategoryModel {
  const closeDialog = useCategoriesStore((state) => state.closeDialog);
  const form = useForm<ICategoryBulkFormValues>({
    resolver: zodResolver(categoryBulkFormSchema),
    defaultValues: {
      items: [emptyCategoryItem],
    },
  });
  const createCategory = useCreateCategory({
    createCategoryService,
    meta: {
      successMessage: createCategoryMessages.success,
      partialMessage: createCategoryMessages.partial,
    },
  });
  const parentOptionsQuery = useGetCategoriesForSelect({ listCategoriesForSelectService });

  const onSubmit = form.handleSubmit((values) => {
    createCategory.mutate(
      values.items.map((item) => ({
        name: item.name,
        type: item.type,
        expenseKind: item.type === CategoryType.DESPESA ? item.expenseKind : null,
        parentId: item.parentId,
      })),
      {
        onSuccess: (result) => {
          if (result.failed.length === 0) {
            closeDialog();
          }
        },
      },
    );
  });

  return {
    form,
    onSubmit,
    onClose: closeDialog,
    isSubmitting: createCategory.isPending,
    parentOptions: parentOptionsQuery.data ?? [],
  };
}
