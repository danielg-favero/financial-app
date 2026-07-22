import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { useResetPassword } from "@/modules/auth/api/mutations/useResetPassword";
import type { ResetPasswordService } from "@/modules/auth/api/services/reset-password.service";
import { resetPasswordMessages } from "@/modules/auth/features/reset-password/reset-password.messages";
import { passwordSchema } from "@/modules/auth/lib/password";

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: resetPasswordMessages.validation.confirmPassword,
    path: ["confirmPassword"],
  });

export type IResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export interface IResetPasswordModel {
  hasCode: boolean;
  form: UseFormReturn<IResetPasswordFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

interface IResetPasswordModelParams {
  code: string | null;
  resetPasswordService: ResetPasswordService;
}

export function useResetPasswordModel({
  code,
  resetPasswordService,
}: IResetPasswordModelParams): IResetPasswordModel {
  const router = useRouter();
  const form = useForm<IResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const resetPassword = useResetPassword({
    resetPasswordService,
    meta: { successMessage: resetPasswordMessages.success },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!code) {
      return;
    }
    resetPassword.mutate(
      {
        token: code,
        password: values.password,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          router.push("/auth/signin");
        },
      },
    );
  });

  return {
    hasCode: code !== null,
    form,
    onSubmit,
    isSubmitting: resetPassword.isPending,
  };
}
