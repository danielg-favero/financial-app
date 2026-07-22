import type { Metadata } from "next";

import { ForgotPasswordContainer } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Recuperar senha",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContainer />;
}
