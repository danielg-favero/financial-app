import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { authMutationKeys } from "@/modules/auth/api/mutations/mutationKeys";
import type { ResetPasswordService } from "@/modules/auth/api/services/reset-password.service";

interface IResetPasswordArgs {
  resetPasswordService: ResetPasswordService;
  meta?: IMutationMeta;
}

export function resetPasswordMutationOptions({ resetPasswordService, meta }: IResetPasswordArgs) {
  return mutationOptions({
    mutationKey: authMutationKeys.resetPassword,
    mutationFn: resetPasswordService.execute.bind(resetPasswordService),
    meta,
  });
}

export function useResetPassword({ resetPasswordService, meta }: IResetPasswordArgs) {
  return useMutation(resetPasswordMutationOptions({ resetPasswordService, meta }));
}
