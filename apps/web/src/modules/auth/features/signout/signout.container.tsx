"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { SignOutService } from "@/modules/auth/api/services/sign-out.service";
import { useSignOutModel } from "@/modules/auth/features/signout/signout.model";
import { SignOutView } from "@/modules/auth/features/signout/signout.view";

const httpClient = new HttpClient();
const signOutService = new SignOutService(httpClient);

export function SignOutContainer() {
  useSignOutModel({ signOutService });

  return <SignOutView />;
}
