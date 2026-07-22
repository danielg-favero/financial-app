import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { authMutationKeys } from "@/modules/auth/api/mutations/mutationKeys";
import type { SignUpService } from "@/modules/auth/api/services/sign-up.service";

interface ISignUpArgs {
  signUpService: SignUpService;
  meta?: IMutationMeta;
}

export function signUpMutationOptions({ signUpService, meta }: ISignUpArgs) {
  return mutationOptions({
    mutationKey: authMutationKeys.signUp,
    mutationFn: signUpService.execute.bind(signUpService),
    meta,
  });
}

export function useSignUp({ signUpService, meta }: ISignUpArgs) {
  return useMutation(signUpMutationOptions({ signUpService, meta }));
}
