import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { authMutationKeys } from "@/modules/auth/api/mutations/mutationKeys";
import type { SignOutService } from "@/modules/auth/api/services/sign-out.service";

interface ISignOutArgs {
  signOutService: SignOutService;
  meta?: IMutationMeta;
}

export function signOutMutationOptions({ signOutService, meta }: ISignOutArgs) {
  return mutationOptions({
    mutationKey: authMutationKeys.signOut,
    mutationFn: signOutService.execute.bind(signOutService),
    meta,
  });
}

export function useSignOut({ signOutService, meta }: ISignOutArgs) {
  return useMutation(signOutMutationOptions({ signOutService, meta }));
}
