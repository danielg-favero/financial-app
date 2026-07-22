import { queryOptions, useQuery } from "@tanstack/react-query";

import { categoryQueryKeys } from "@/modules/categories/api/queries/queryKeys";
import type { ListCategoriesForSelectService } from "@/modules/categories/api/services/list-categories-for-select.service";

interface IGetCategoriesForSelectArgs {
  listCategoriesForSelectService: ListCategoriesForSelectService;
}

export function getCategoriesForSelectOptions({
  listCategoriesForSelectService,
}: IGetCategoriesForSelectArgs) {
  return queryOptions({
    queryKey: categoryQueryKeys.select,
    queryFn: () => listCategoriesForSelectService.execute(),
  });
}

export function useGetCategoriesForSelect({
  listCategoriesForSelectService,
}: IGetCategoriesForSelectArgs) {
  return useQuery(getCategoriesForSelectOptions({ listCategoriesForSelectService }));
}
