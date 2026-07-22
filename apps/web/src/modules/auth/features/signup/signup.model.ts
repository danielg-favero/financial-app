import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { useSignUp } from "@/modules/auth/api/mutations/useSignUp";
import type { SignUpService } from "@/modules/auth/api/services/sign-up.service";
import { signUpMessages } from "@/modules/auth/features/signup/signup.messages";
import { passwordSchema } from "@/modules/auth/lib/password";

const signUpSchema = z
  .object({
    firstName: z.string().min(1, signUpMessages.validation.firstName),
    lastName: z.string().min(1, signUpMessages.validation.lastName),
    email: z.email(signUpMessages.validation.email),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: signUpMessages.validation.confirmPassword,
    path: ["confirmPassword"],
  });

export type ISignUpFormValues = z.infer<typeof signUpSchema>;

export interface ISignUpModel {
  form: UseFormReturn<ISignUpFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

interface ISignUpModelParams {
  signUpService: SignUpService;
}

export function useSignUpModel({ signUpService }: ISignUpModelParams): ISignUpModel {
  const router = useRouter();
  const form = useForm<ISignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const signUp = useSignUp({
    signUpService,
    meta: { successMessage: signUpMessages.success },
  });

  const onSubmit = form.handleSubmit((values) => {
    signUp.mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          router.push("/auth/verify-email-pending");
        },
      },
    );
  });

  return { form, onSubmit, isSubmitting: signUp.isPending };
}
