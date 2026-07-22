import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { authMutationKeys } from "@/modules/auth/api/mutations/mutationKeys";
import type { DeleteAccountService } from "@/modules/auth/api/services/delete-account.service";

interface IDeleteAccountArgs {
  deleteAccountService: DeleteAccountService;
  meta?: IMutationMeta;
}

export function deleteAccountMutationOptions({ deleteAccountService, meta }: IDeleteAccountArgs) {
  return mutationOptions({
    mutationKey: authMutationKeys.deleteAccount,
    mutationFn: deleteAccountService.execute.bind(deleteAccountService),
    meta,
  });
}

export function useDeleteAccount({ deleteAccountService, meta }: IDeleteAccountArgs) {
  return useMutation(deleteAccountMutationOptions({ deleteAccountService, meta }));
}
