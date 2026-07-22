import { useEffect, useRef, useState } from "react";

import { resolveErrorMessage } from "@/shared/infra/http/error-messages";

import { useVerifyEmail } from "@/modules/auth/api/mutations/useVerifyEmail";
import type { VerifyEmailService } from "@/modules/auth/api/services/verify-email.service";
import { verifyEmailMessages } from "@/modules/auth/features/verify-email/verify-email.messages";

export type VerifyEmailStatus = "verifying" | "success" | "error";

export interface IVerifyEmailModel {
  status: VerifyEmailStatus;
  errorMessage: string | null;
}

interface IVerifyEmailModelParams {
  code: string | null;
  verifyEmailService: VerifyEmailService;
}

export function useVerifyEmailModel({
  code,
  verifyEmailService,
}: IVerifyEmailModelParams): IVerifyEmailModel {
  const { mutateAsync } = useVerifyEmail({ verifyEmailService });
  const [result, setResult] = useState<IVerifyEmailModel>({
    status: "verifying",
    errorMessage: null,
  });
  const hasFired = useRef(false);

  useEffect(() => {
    if (!code || hasFired.current) {
      return;
    }
    hasFired.current = true;
    // Track the outcome locally: the mutation's observer-bound result stops
    // updating once StrictMode's remount detaches this observer, which would
    // leave the page spinning even though the email was verified
    void mutateAsync({ token: code })
      .then(() => {
        setResult({ status: "success", errorMessage: null });
      })
      .catch((error: unknown) => {
        setResult({ status: "error", errorMessage: resolveErrorMessage(error) });
      });
  }, [code, mutateAsync]);

  if (!code) {
    return { status: "error", errorMessage: verifyEmailMessages.missingCode };
  }

  return result;
}
