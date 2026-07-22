"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { SignInService } from "@/modules/auth/api/services/sign-in.service";
import { useSignInModel } from "@/modules/auth/features/signin/signin.model";
import { SignInView } from "@/modules/auth/features/signin/signin.view";

const httpClient = new HttpClient();
const signInService = new SignInService(httpClient);

export function SignInContainer() {
  const model = useSignInModel({ signInService });

  return <SignInView {...model} />;
}
