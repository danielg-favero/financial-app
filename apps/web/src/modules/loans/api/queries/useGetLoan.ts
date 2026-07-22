import { queryOptions, useQuery } from "@tanstack/react-query";

import { loanQueryKeys } from "@/modules/loans/api/queries/queryKeys";
import type { GetLoanService } from "@/modules/loans/api/services/get-loan.service";

interface IGetLoanArgs {
  getLoanService: GetLoanService;
  id: string;
}

export function getLoanOptions({ getLoanService, id }: IGetLoanArgs) {
  return queryOptions({
    queryKey: loanQueryKeys.detail(id),
    queryFn: () => getLoanService.execute(id),
  });
}

export function useGetLoan({ getLoanService, id }: IGetLoanArgs) {
  return useQuery(getLoanOptions({ getLoanService, id }));
}
