import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { transactionMutationKeys } from "@/modules/transactions/api/mutations/mutationKeys";
import { transactionQueryKeys } from "@/modules/transactions/api/queries/queryKeys";
import type { DeleteTransactionService } from "@/modules/transactions/api/services/delete-transaction.service";

interface IDeleteTransactionArgs {
  deleteTransactionService: DeleteTransactionService;
  meta?: IMutationMeta;
}

export function deleteTransactionMutationOptions({
  deleteTransactionService,
  meta,
}: IDeleteTransactionArgs) {
  return mutationOptions({
    mutationKey: transactionMutationKeys.delete,
    mutationFn: deleteTransactionService.execute.bind(deleteTransactionService),
    meta: { invalidates: [transactionQueryKeys.root], ...meta },
  });
}

export function useDeleteTransaction({ deleteTransactionService, meta }: IDeleteTransactionArgs) {
  return useMutation(deleteTransactionMutationOptions({ deleteTransactionService, meta }));
}
