import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useSignOut } from "@/modules/auth/api/mutations/useSignOut";
import type { SignOutService } from "@/modules/auth/api/services/sign-out.service";
import { signOutMessages } from "@/modules/auth/features/signout/signout.messages";

interface ISignOutModelParams {
  signOutService: SignOutService;
}

export function useSignOutModel({ signOutService }: ISignOutModelParams): void {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync } = useSignOut({
    signOutService,
    meta: { successMessage: signOutMessages.success },
  });
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) {
      return;
    }
    hasFired.current = true;
    // Settle from the mutation's own promise: the callbacks passed to `mutate`
    // are skipped once StrictMode's remount detaches this observer from the
    // in-flight mutation, which would strand the user on this page
    void mutateAsync(undefined)
      .catch(() => undefined) // failures are already toasted by the mutation cache
      .finally(() => {
        queryClient.clear();
        router.replace("/auth/signin");
      });
  }, [mutateAsync, queryClient, router]);
}
