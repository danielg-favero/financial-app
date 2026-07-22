import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 12;

export interface IPasswordRule {
  id: string;
  label: string;
  validate: (password: string) => boolean;
}

export const passwordRules: readonly IPasswordRule[] = [
  {
    id: "minLength",
    label: `Pelo menos ${PASSWORD_MIN_LENGTH} caracteres`,
    validate: (password) => password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "lowercase",
    label: "Uma letra minúscula",
    validate: (password) => /[a-z]/.test(password),
  },
  {
    id: "uppercase",
    label: "Uma letra maiúscula",
    validate: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "Um número",
    validate: (password) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "Um caractere especial",
    validate: (password) => /[^A-Za-z0-9]/.test(password),
  },
  {
    id: "noWhitespace",
    label: "Sem espaços em branco",
    validate: (password) => !/\s/.test(password),
  },
];

/**
 * Zod schema that enforces every password rule, surfacing the label of the
 * first violated rule as the validation message.
 */
export const passwordSchema = passwordRules.reduce(
  (schema, rule) => schema.refine(rule.validate, { message: rule.label }),
  z.string(),
);
