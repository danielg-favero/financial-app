"use client";

import { useSearchParams } from "next/navigation";

import { HttpClient } from "@/shared/infra/http/client";

import { ResetPasswordService } from "@/modules/auth/api/services/reset-password.service";
import { useResetPasswordModel } from "@/modules/auth/features/reset-password/reset-password.model";
import { ResetPasswordView } from "@/modules/auth/features/reset-password/reset-password.view";

const httpClient = new HttpClient();
const resetPasswordService = new ResetPasswordService(httpClient);

export function ResetPasswordContainer() {
  const searchParams = useSearchParams();
  const model = useResetPasswordModel({ code: searchParams.get("code"), resetPasswordService });

  return <ResetPasswordView {...model} />;
}
