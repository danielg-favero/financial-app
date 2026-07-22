import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useDeleteAccount } from "@/modules/auth/api/mutations/useDeleteAccount";
import type { DeleteAccountService } from "@/modules/auth/api/services/delete-account.service";
import { deleteAccountMessages } from "@/modules/auth/features/delete-account/delete-account.messages";

export interface IDeleteAccountModel {
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

interface IDeleteAccountModelParams {
  deleteAccountService: DeleteAccountService;
}

export function useDeleteAccountModel({
  deleteAccountService,
}: IDeleteAccountModelParams): IDeleteAccountModel {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteAccount = useDeleteAccount({
    deleteAccountService,
    meta: { successMessage: deleteAccountMessages.success },
  });

  const onConfirm = () => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        router.replace("/auth/signin");
      },
    });
  };

  return {
    isDialogOpen,
    onDialogOpenChange: setIsDialogOpen,
    onConfirm,
    isDeleting: deleteAccount.isPending,
  };
}
