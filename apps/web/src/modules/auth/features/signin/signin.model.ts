import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { EMAIL_NOT_VERIFIED_ERROR, getApiErrorCode } from "@/shared/infra/http/error-messages";

import { useSignIn } from "@/modules/auth/api/mutations/useSignIn";
import type { SignInService } from "@/modules/auth/api/services/sign-in.service";
import { signInMessages } from "@/modules/auth/features/signin/signin.messages";

const signInSchema = z.object({
  email: z.email(signInMessages.validation.email),
  password: z.string().min(1, signInMessages.validation.password),
});

export type ISignInFormValues = z.infer<typeof signInSchema>;

export interface ISignInModel {
  form: UseFormReturn<ISignInFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

interface ISignInModelParams {
  signInService: SignInService;
}

export function useSignInModel({ signInService }: ISignInModelParams): ISignInModel {
  const router = useRouter();
  const form = useForm<ISignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const signIn = useSignIn({
    signInService,
    meta: { successMessage: signInMessages.success },
  });

  const onSubmit = form.handleSubmit((values) => {
    signIn.mutate(values, {
      onSuccess: () => {
        router.push("/");
      },
      onError: (error) => {
        if (getApiErrorCode(error) === EMAIL_NOT_VERIFIED_ERROR) {
          router.push("/auth/verify-email-pending");
        }
      },
    });
  });

  return { form, onSubmit, isSubmitting: signIn.isPending };
}
