import { queryOptions, useQuery } from "@tanstack/react-query";

import { transactionQueryKeys } from "@/modules/transactions/api/queries/queryKeys";
import type { GetTransactionService } from "@/modules/transactions/api/services/get-transaction.service";

interface IGetTransactionArgs {
  getTransactionService: GetTransactionService;
  id: string;
}

export function getTransactionOptions({ getTransactionService, id }: IGetTransactionArgs) {
  return queryOptions({
    queryKey: transactionQueryKeys.detail(id),
    queryFn: () => getTransactionService.execute(id),
  });
}

export function useGetTransaction({ getTransactionService, id }: IGetTransactionArgs) {
  return useQuery(getTransactionOptions({ getTransactionService, id }));
}
