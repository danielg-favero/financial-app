import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { authMutationKeys } from "@/modules/auth/api/mutations/mutationKeys";
import type { VerifyEmailService } from "@/modules/auth/api/services/verify-email.service";

interface IVerifyEmailArgs {
  verifyEmailService: VerifyEmailService;
  meta?: IMutationMeta;
}

export function verifyEmailMutationOptions({ verifyEmailService, meta }: IVerifyEmailArgs) {
  return mutationOptions({
    mutationKey: authMutationKeys.verifyEmail,
    mutationFn: verifyEmailService.execute.bind(verifyEmailService),
    meta,
  });
}

export function useVerifyEmail({ verifyEmailService, meta }: IVerifyEmailArgs) {
  return useMutation(verifyEmailMutationOptions({ verifyEmailService, meta }));
}
