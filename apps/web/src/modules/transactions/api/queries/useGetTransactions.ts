import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";

import { transactionQueryKeys } from "@/modules/transactions/api/queries/queryKeys";
import type {
  IListTransactionsParams,
  ListTransactionsService,
} from "@/modules/transactions/api/services/list-transactions.service";

interface IGetTransactionsArgs {
  listTransactionsService: ListTransactionsService;
  params: IListTransactionsParams;
}

export function getTransactionsOptions({ listTransactionsService, params }: IGetTransactionsArgs) {
  return queryOptions({
    queryKey: transactionQueryKeys.list(params),
    queryFn: () => listTransactionsService.execute(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetTransactions({ listTransactionsService, params }: IGetTransactionsArgs) {
  return useQuery(getTransactionsOptions({ listTransactionsService, params }));
}
