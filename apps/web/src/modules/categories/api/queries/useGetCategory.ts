import { queryOptions, useQuery } from "@tanstack/react-query";

import { categoryQueryKeys } from "@/modules/categories/api/queries/queryKeys";
import type { GetCategoryService } from "@/modules/categories/api/services/get-category.service";

interface IGetCategoryArgs {
  getCategoryService: GetCategoryService;
  id: string;
}

export function getCategoryOptions({ getCategoryService, id }: IGetCategoryArgs) {
  return queryOptions({
    queryKey: categoryQueryKeys.detail(id),
    queryFn: () => getCategoryService.execute(id),
  });
}

export function useGetCategory({ getCategoryService, id }: IGetCategoryArgs) {
  return useQuery(getCategoryOptions({ getCategoryService, id }));
}
