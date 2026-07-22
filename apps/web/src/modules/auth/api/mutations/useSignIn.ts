import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { authMutationKeys } from "@/modules/auth/api/mutations/mutationKeys";
import type { SignInService } from "@/modules/auth/api/services/sign-in.service";

interface ISignInArgs {
  signInService: SignInService;
  meta?: IMutationMeta;
}

export function signInMutationOptions({ signInService, meta }: ISignInArgs) {
  return mutationOptions({
    mutationKey: authMutationKeys.signIn,
    mutationFn: signInService.execute.bind(signInService),
    meta,
  });
}

export function useSignIn({ signInService, meta }: ISignInArgs) {
  return useMutation(signInMutationOptions({ signInService, meta }));
}
