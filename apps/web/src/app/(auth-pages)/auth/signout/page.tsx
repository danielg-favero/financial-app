import type { Metadata } from "next";

import { SignOutContainer } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Sair",
};

export default function SignOutPage() {
  return <SignOutContainer />;
}
