import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { loanMutationKeys } from "@/modules/loans/api/mutations/mutationKeys";
import { loanQueryKeys } from "@/modules/loans/api/queries/queryKeys";
import type { CreateLoanService } from "@/modules/loans/api/services/create-loan.service";

interface ICreateLoanArgs {
  createLoanService: CreateLoanService;
  meta?: IMutationMeta;
}

export function createLoanMutationOptions({ createLoanService, meta }: ICreateLoanArgs) {
  return mutationOptions({
    mutationKey: loanMutationKeys.create,
    mutationFn: createLoanService.execute.bind(createLoanService),
    meta: { invalidates: [loanQueryKeys.root], ...meta },
  });
}

export function useCreateLoan({ createLoanService, meta }: ICreateLoanArgs) {
  return useMutation(createLoanMutationOptions({ createLoanService, meta }));
}
