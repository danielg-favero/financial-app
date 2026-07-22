import { mutationOptions, useMutation } from "@tanstack/react-query";

import type { IMutationMeta } from "@/shared/infra/query/query-client";

import { authMutationKeys } from "@/modules/auth/api/mutations/mutationKeys";
import { authQueryKeys } from "@/modules/auth/api/queries/queryKeys";
import type { UpdateProfileService } from "@/modules/auth/api/services/update-profile.service";

interface IUpdateProfileArgs {
  updateProfileService: UpdateProfileService;
  meta?: IMutationMeta;
}

export function updateProfileMutationOptions({ updateProfileService, meta }: IUpdateProfileArgs) {
  return mutationOptions({
    mutationKey: authMutationKeys.updateProfile,
    mutationFn: updateProfileService.execute.bind(updateProfileService),
    meta: { invalidates: [authQueryKeys.me], ...meta },
  });
}

export function useUpdateProfile({ updateProfileService, meta }: IUpdateProfileArgs) {
  return useMutation(updateProfileMutationOptions({ updateProfileService, meta }));
}
