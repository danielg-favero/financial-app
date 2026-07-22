import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { useForgotPassword } from "@/modules/auth/api/mutations/useForgotPassword";
import type { ForgotPasswordService } from "@/modules/auth/api/services/forgot-password.service";
import { forgotPasswordMessages } from "@/modules/auth/features/forgot-password/forgot-password.messages";

const forgotPasswordSchema = z.object({
  email: z.email(forgotPasswordMessages.validation.email),
});

export type IForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export interface IForgotPasswordModel {
  form: UseFormReturn<IForgotPasswordFormValues>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

interface IForgotPasswordModelParams {
  forgotPasswordService: ForgotPasswordService;
}

export function useForgotPasswordModel({
  forgotPasswordService,
}: IForgotPasswordModelParams): IForgotPasswordModel {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<IForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const forgotPassword = useForgotPassword({ forgotPasswordService });

  const onSubmit = form.handleSubmit((values) => {
    forgotPassword.mutate(values, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  });

  return {
    form,
    onSubmit,
    isSubmitting: forgotPassword.isPending,
    isSubmitted,
  };
}
