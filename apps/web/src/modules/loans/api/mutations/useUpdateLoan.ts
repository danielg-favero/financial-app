import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { loanMutationKeys } from "@/modules/loans/api/mutations/mutationKeys";
import { loanQueryKeys } from "@/modules/loans/api/queries/queryKeys";
import type { UpdateLoanService } from "@/modules/loans/api/services/update-loan.service";

interface IUpdateLoanArgs {
  updateLoanService: UpdateLoanService;
  meta?: IMutationMeta;
}

export function updateLoanMutationOptions({ updateLoanService, meta }: IUpdateLoanArgs) {
  return mutationOptions({
    mutationKey: loanMutationKeys.update,
    mutationFn: updateLoanService.execute.bind(updateLoanService),
    meta: { invalidates: [loanQueryKeys.root], ...meta },
  });
}

export function useUpdateLoan({ updateLoanService, meta }: IUpdateLoanArgs) {
  return useMutation(updateLoanMutationOptions({ updateLoanService, meta }));
}
