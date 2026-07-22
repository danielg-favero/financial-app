import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { categoryMutationKeys } from "@/modules/categories/api/mutations/mutationKeys";
import { categoryQueryKeys } from "@/modules/categories/api/queries/queryKeys";
import type { DeleteCategoryService } from "@/modules/categories/api/services/delete-category.service";

interface IDeleteCategoryArgs {
  deleteCategoryService: DeleteCategoryService;
  meta?: IMutationMeta;
}

export function deleteCategoryMutationOptions({
  deleteCategoryService,
  meta,
}: IDeleteCategoryArgs) {
  return mutationOptions({
    mutationKey: categoryMutationKeys.delete,
    mutationFn: deleteCategoryService.execute.bind(deleteCategoryService),
    meta: { invalidates: [categoryQueryKeys.root], ...meta },
  });
}

export function useDeleteCategory({ deleteCategoryService, meta }: IDeleteCategoryArgs) {
  return useMutation(deleteCategoryMutationOptions({ deleteCategoryService, meta }));
}
