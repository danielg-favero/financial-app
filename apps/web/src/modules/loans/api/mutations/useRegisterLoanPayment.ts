import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { loanMutationKeys } from "@/modules/loans/api/mutations/mutationKeys";
import { loanQueryKeys } from "@/modules/loans/api/queries/queryKeys";
import type { UpdateLoanService } from "@/modules/loans/api/services/update-loan.service";
import type { ILoan } from "@/modules/loans/types/loan";

export interface IRegisterLoanPaymentInput {
  loan: ILoan;
  paymentAmount: number;
}

interface IRegisterLoanPaymentArgs {
  updateLoanService: UpdateLoanService;
  meta?: IMutationMeta;
}

export function registerLoanPaymentMutationOptions({
  updateLoanService,
  meta,
}: IRegisterLoanPaymentArgs) {
  return mutationOptions({
    mutationKey: loanMutationKeys.registerPayment,
    /**
     * Registers a payment by sending the new `amountReceived` total; the backend
     * recomputes `amountReceived`, `openBalance` and `isPaid`.
     */
    mutationFn: ({ loan, paymentAmount }: IRegisterLoanPaymentInput): Promise<ILoan> =>
      updateLoanService.execute({
        id: loan.id,
        dto: { amountReceived: loan.amountReceived + paymentAmount },
      }),
    meta: { invalidates: [loanQueryKeys.root], ...meta },
  });
}

export function useRegisterLoanPayment({ updateLoanService, meta }: IRegisterLoanPaymentArgs) {
  return useMutation(registerLoanPaymentMutationOptions({ updateLoanService, meta }));
}
