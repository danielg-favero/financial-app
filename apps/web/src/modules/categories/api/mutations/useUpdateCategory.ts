import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { categoryMutationKeys } from "@/modules/categories/api/mutations/mutationKeys";
import { categoryQueryKeys } from "@/modules/categories/api/queries/queryKeys";
import type { UpdateCategoryService } from "@/modules/categories/api/services/update-category.service";

interface IUpdateCategoryArgs {
  updateCategoryService: UpdateCategoryService;
  meta?: IMutationMeta;
}

export function updateCategoryMutationOptions({
  updateCategoryService,
  meta,
}: IUpdateCategoryArgs) {
  return mutationOptions({
    mutationKey: categoryMutationKeys.update,
    mutationFn: updateCategoryService.execute.bind(updateCategoryService),
    meta: { invalidates: [categoryQueryKeys.root], ...meta },
  });
}

export function useUpdateCategory({ updateCategoryService, meta }: IUpdateCategoryArgs) {
  return useMutation(updateCategoryMutationOptions({ updateCategoryService, meta }));
}
