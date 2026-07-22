"use client";

import { HttpClient } from "@/shared/infra/http/client";

import { SignUpService } from "@/modules/auth/api/services/sign-up.service";
import { useSignUpModel } from "@/modules/auth/features/signup/signup.model";
import { SignUpView } from "@/modules/auth/features/signup/signup.view";

const httpClient = new HttpClient();
const signUpService = new SignUpService(httpClient);

export function SignUpContainer() {
  const model = useSignUpModel({ signUpService });

  return <SignUpView {...model} />;
}
