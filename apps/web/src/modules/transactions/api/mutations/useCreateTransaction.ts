import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { transactionMutationKeys } from "@/modules/transactions/api/mutations/mutationKeys";
import { transactionQueryKeys } from "@/modules/transactions/api/queries/queryKeys";
import type { CreateTransactionService } from "@/modules/transactions/api/services/create-transaction.service";

interface ICreateTransactionArgs {
  createTransactionService: CreateTransactionService;
  meta?: IMutationMeta;
}

export function createTransactionMutationOptions({
  createTransactionService,
  meta,
}: ICreateTransactionArgs) {
  return mutationOptions({
    mutationKey: transactionMutationKeys.create,
    mutationFn: createTransactionService.execute.bind(createTransactionService),
    meta: { invalidates: [transactionQueryKeys.root], ...meta },
  });
}

export function useCreateTransaction({ createTransactionService, meta }: ICreateTransactionArgs) {
  return useMutation(createTransactionMutationOptions({ createTransactionService, meta }));
}
