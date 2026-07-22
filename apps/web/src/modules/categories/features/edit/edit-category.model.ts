import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";

import { useUpdateCategory } from "@/modules/categories/api/mutations/useUpdateCategory";
import { useGetCategoriesForSelect } from "@/modules/categories/api/queries/useGetCategoriesForSelect";
import type { ListCategoriesForSelectService } from "@/modules/categories/api/services/list-categories-for-select.service";
import type { UpdateCategoryService } from "@/modules/categories/api/services/update-category.service";
import {
  categoryFormSchema,
  type ICategoryFormValues,
} from "@/modules/categories/components/category-form";
import { editCategoryMessages } from "@/modules/categories/features/edit/edit-category.messages";
import { useCategoriesStore } from "@/modules/categories/store";
import { CategoryType, type ICategory } from "@/modules/categories/types/category";

export interface IEditCategoryModel {
  form: UseFormReturn<ICategoryFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isSubmitting: boolean;
  parentOptions: ICategory[];
}

interface IEditCategoryModelParams {
  category: ICategory;
  updateCategoryService: UpdateCategoryService;
  listCategoriesForSelectService: ListCategoriesForSelectService;
}

export function useEditCategoryModel({
  category,
  updateCategoryService,
  listCategoriesForSelectService,
}: IEditCategoryModelParams): IEditCategoryModel {
  const closeDialog = useCategoriesStore((state) => state.closeDialog);
  const form = useForm<ICategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category.name,
      type: category.type,
      expenseKind: category.expenseKind,
      parentId: category.parentId,
    },
  });
  const updateCategory = useUpdateCategory({
    updateCategoryService,
    meta: { successMessage: editCategoryMessages.success },
  });
  const parentOptionsQuery = useGetCategoriesForSelect({ listCategoriesForSelectService });

  const onSubmit = form.handleSubmit((values) => {
    updateCategory.mutate(
      {
        id: category.id,
        dto: {
          name: values.name,
          type: values.type,
          expenseKind: values.type === CategoryType.DESPESA ? values.expenseKind : null,
          parentId: values.parentId,
        },
      },
      { onSuccess: closeDialog },
    );
  });

  const parentOptions = (parentOptionsQuery.data ?? []).filter(
    (option) => option.id !== category.id,
  );

  return {
    form,
    onSubmit,
    onClose: closeDialog,
    isSubmitting: updateCategory.isPending,
    parentOptions,
  };
}
