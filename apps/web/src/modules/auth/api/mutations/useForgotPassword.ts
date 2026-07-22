import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { authMutationKeys } from "@/modules/auth/api/mutations/mutationKeys";
import type { ForgotPasswordService } from "@/modules/auth/api/services/forgot-password.service";

interface IForgotPasswordArgs {
  forgotPasswordService: ForgotPasswordService;
  meta?: IMutationMeta;
}

export function forgotPasswordMutationOptions({ forgotPasswordService, meta }: IForgotPasswordArgs) {
  return mutationOptions({
    mutationKey: authMutationKeys.forgotPassword,
    mutationFn: forgotPasswordService.execute.bind(forgotPasswordService),
    meta,
  });
}

export function useForgotPassword({ forgotPasswordService, meta }: IForgotPasswordArgs) {
  return useMutation(forgotPasswordMutationOptions({ forgotPasswordService, meta }));
}
