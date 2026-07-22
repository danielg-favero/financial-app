import { useDeleteCategory } from "@/modules/categories/api/mutations/useDeleteCategory";
import type { DeleteCategoryService } from "@/modules/categories/api/services/delete-category.service";
import { deleteCategoryMessages } from "@/modules/categories/features/delete/delete-category.messages";
import { useCategoriesStore } from "@/modules/categories/store";
import type { ICategory } from "@/modules/categories/types/category";

export interface IDeleteCategoryModel {
  categoryNames: string[];
  onConfirm: () => void;
  onClose: () => void;
  isDeleting: boolean;
}

interface IDeleteCategoryModelParams {
  categories: ICategory[];
  deleteCategoryService: DeleteCategoryService;
}

export function useDeleteCategoryModel({
  categories,
  deleteCategoryService,
}: IDeleteCategoryModelParams): IDeleteCategoryModel {
  const closeDialog = useCategoriesStore((state) => state.closeDialog);
  const clearSelected = useCategoriesStore((state) => state.clearSelected);
  const deleteCategory = useDeleteCategory({
    deleteCategoryService,
    meta: {
      successMessage: deleteCategoryMessages.success,
      partialMessage: deleteCategoryMessages.partial,
    },
  });

  const onConfirm = () => {
    deleteCategory.mutate(
      categories.map((category) => category.id),
      {
        onSuccess: (result) => {
          clearSelected();
          if (result.failed.length === 0) {
            closeDialog();
          }
        },
      },
    );
  };

  return {
    categoryNames: categories.map((category) => category.name),
    onConfirm,
    onClose: closeDialog,
    isDeleting: deleteCategory.isPending,
  };
}
