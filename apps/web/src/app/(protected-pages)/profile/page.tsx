import type { Metadata } from "next";

import { DeleteAccountContainer, ProfileContainer } from "@/modules/auth";

export const metadata: Metadata = {
  title: "Perfil",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <ProfileContainer />
      <DeleteAccountContainer />
    </div>
  );
}
