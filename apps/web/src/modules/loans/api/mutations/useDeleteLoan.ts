import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { loanMutationKeys } from "@/modules/loans/api/mutations/mutationKeys";
import { loanQueryKeys } from "@/modules/loans/api/queries/queryKeys";
import type { DeleteLoanService } from "@/modules/loans/api/services/delete-loan.service";

interface IDeleteLoanArgs {
  deleteLoanService: DeleteLoanService;
  meta?: IMutationMeta;
}

export function deleteLoanMutationOptions({ deleteLoanService, meta }: IDeleteLoanArgs) {
  return mutationOptions({
    mutationKey: loanMutationKeys.delete,
    mutationFn: deleteLoanService.execute.bind(deleteLoanService),
    meta: { invalidates: [loanQueryKeys.root], ...meta },
  });
}

export function useDeleteLoan({ deleteLoanService, meta }: IDeleteLoanArgs) {
  return useMutation(deleteLoanMutationOptions({ deleteLoanService, meta }));
}
