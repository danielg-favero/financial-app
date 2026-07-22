import type { Metadata } from "next";

import { SignUpContainer } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default function SignUpPage() {
  return <SignUpContainer />;
}
