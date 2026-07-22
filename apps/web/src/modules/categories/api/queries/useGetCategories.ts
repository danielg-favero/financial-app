import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";

import { categoryQueryKeys } from "@/modules/categories/api/queries/queryKeys";
import type {
  IListCategoriesParams,
  ListCategoriesService,
} from "@/modules/categories/api/services/list-categories.service";

interface IGetCategoriesArgs {
  listCategoriesService: ListCategoriesService;
  params: IListCategoriesParams;
}

export function getCategoriesOptions({ listCategoriesService, params }: IGetCategoriesArgs) {
  return queryOptions({
    queryKey: categoryQueryKeys.list(params),
    queryFn: () => listCategoriesService.execute(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetCategories({ listCategoriesService, params }: IGetCategoriesArgs) {
  return useQuery(getCategoriesOptions({ listCategoriesService, params }));
}
