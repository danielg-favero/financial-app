import { queryOptions, useQuery } from "@tanstack/react-query";

import { authQueryKeys } from "@/modules/auth/api/queries/queryKeys";
import type { GetMeService } from "@/modules/auth/api/services/get-me.service";

interface IGetMeArgs {
  getMeService: GetMeService;
}

export function getMeOptions({ getMeService }: IGetMeArgs) {
  return queryOptions({
    queryKey: authQueryKeys.me,
    queryFn: () => getMeService.execute(),
  });
}

export function useGetMe({ getMeService }: IGetMeArgs) {
  return useQuery(getMeOptions({ getMeService }));
}
