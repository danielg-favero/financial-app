"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { DeleteAccountService } from "@/modules/auth/api/services/delete-account.service";
import { useDeleteAccountModel } from "@/modules/auth/features/delete-account/delete-account.model";
import { DeleteAccountView } from "@/modules/auth/features/delete-account/delete-account.view";

const httpClient = new HttpClient();
const deleteAccountService = new DeleteAccountService(httpClient);

export function DeleteAccountContainer() {
  const model = useDeleteAccountModel({ deleteAccountService });

  return <DeleteAccountView {...model} />;
}
