import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordContainer } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Redefinir senha",
};

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContainer />
    </Suspense>
  );
}
