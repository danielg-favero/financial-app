import { z } from "zod";

import { PasswordPolicyProvider } from "../../providers/password-policy.provider.ts";

const passwordPolicy = new PasswordPolicyProvider();

const passwordSchema = passwordPolicy
  .getPasswordRules()
  .reduce(
    (schema, rule) => schema.refine(rule.validate, { message: rule.message }),
    z.string(),
  );

export const signUpBodySchema = z.object({
  email: z.email(),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const signInBodySchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const verifyEmailBodySchema = z.object({
  token: z.string().min(1),
});

export const updateProfileBodySchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
});

export const forgotPasswordBodySchema = z.object({
  email: z.email(),
});

export const resetPasswordBodySchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
  confirmPassword: passwordSchema,
});
