import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";

import { loanQueryKeys } from "@/modules/loans/api/queries/queryKeys";
import type {
  IListLoansParams,
  ListLoansService,
} from "@/modules/loans/api/services/list-loans.service";

interface IGetLoansArgs {
  listLoansService: ListLoansService;
  params: IListLoansParams;
}

export function getLoansOptions({ listLoansService, params }: IGetLoansArgs) {
  return queryOptions({
    queryKey: loanQueryKeys.list(params),
    queryFn: () => listLoansService.execute(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetLoans({ listLoansService, params }: IGetLoansArgs) {
  return useQuery(getLoansOptions({ listLoansService, params }));
}
