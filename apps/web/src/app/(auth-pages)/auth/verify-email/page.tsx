import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyEmailContainer } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Confirmação de e-mail",
};

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContainer />
    </Suspense>
  );
}
