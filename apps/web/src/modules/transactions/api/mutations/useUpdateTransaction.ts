import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { transactionMutationKeys } from "@/modules/transactions/api/mutations/mutationKeys";
import { transactionQueryKeys } from "@/modules/transactions/api/queries/queryKeys";
import type { UpdateTransactionService } from "@/modules/transactions/api/services/update-transaction.service";

interface IUpdateTransactionArgs {
  updateTransactionService: UpdateTransactionService;
  meta?: IMutationMeta;
}

export function updateTransactionMutationOptions({
  updateTransactionService,
  meta,
}: IUpdateTransactionArgs) {
  return mutationOptions({
    mutationKey: transactionMutationKeys.update,
    mutationFn: updateTransactionService.execute.bind(updateTransactionService),
    meta: { invalidates: [transactionQueryKeys.root], ...meta },
  });
}

export function useUpdateTransaction({ updateTransactionService, meta }: IUpdateTransactionArgs) {
  return useMutation(updateTransactionMutationOptions({ updateTransactionService, meta }));
}
