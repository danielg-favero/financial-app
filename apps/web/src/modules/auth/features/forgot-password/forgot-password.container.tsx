"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { ForgotPasswordService } from "@/modules/auth/api/services/forgot-password.service";
import { useForgotPasswordModel } from "@/modules/auth/features/forgot-password/forgot-password.model";
import { ForgotPasswordView } from "@/modules/auth/features/forgot-password/forgot-password.view";

const httpClient = new HttpClient();
const forgotPasswordService = new ForgotPasswordService(httpClient);

export function ForgotPasswordContainer() {
  const model = useForgotPasswordModel({ forgotPasswordService });

  return <ForgotPasswordView {...model} />;
}
