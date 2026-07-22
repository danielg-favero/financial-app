import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { categoryMutationKeys } from "@/modules/categories/api/mutations/mutationKeys";
import { categoryQueryKeys } from "@/modules/categories/api/queries/queryKeys";
import type { CreateCategoryService } from "@/modules/categories/api/services/create-category.service";

interface ICreateCategoryArgs {
  createCategoryService: CreateCategoryService;
  meta?: IMutationMeta;
}

export function createCategoryMutationOptions({
  createCategoryService,
  meta,
}: ICreateCategoryArgs) {
  return mutationOptions({
    mutationKey: categoryMutationKeys.create,
    mutationFn: createCategoryService.execute.bind(createCategoryService),
    meta: { invalidates: [categoryQueryKeys.root], ...meta },
  });
}

export function useCreateCategory({ createCategoryService, meta }: ICreateCategoryArgs) {
  return useMutation(createCategoryMutationOptions({ createCategoryService, meta }));
}
