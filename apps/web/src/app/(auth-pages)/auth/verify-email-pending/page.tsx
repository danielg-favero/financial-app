import type { Metadata } from "next";

import { VerifyEmailPendingContainer } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Confirme seu e-mail",
};

export default function VerifyEmailPendingPage() {
  return <VerifyEmailPendingContainer />;
}
