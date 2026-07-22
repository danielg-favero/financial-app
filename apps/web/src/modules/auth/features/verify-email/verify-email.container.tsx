"use client";

import { useSearchParams } from "next/navigation";

import { HttpClient } from "@/shared/infra/http/client";

import { VerifyEmailService } from "@/modules/auth/api/services/verify-email.service";
import { useVerifyEmailModel } from "@/modules/auth/features/verify-email/verify-email.model";
import { VerifyEmailView } from "@/modules/auth/features/verify-email/verify-email.view";

const httpClient = new HttpClient();
const verifyEmailService = new VerifyEmailService(httpClient);

export function VerifyEmailContainer() {
  const searchParams = useSearchParams();
  const model = useVerifyEmailModel({ code: searchParams.get("code"), verifyEmailService });

  return <VerifyEmailView {...model} />;
}
