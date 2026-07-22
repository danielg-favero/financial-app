import type { Metadata } from "next";

import { SignInContainer } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function SignInPage() {
  return <SignInContainer />;
}
