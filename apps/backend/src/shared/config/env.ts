import { z } from "zod";

const envSchema = z
  .object({
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PORT: z.coerce.number().int().positive().default(5432),
    POSTGRES_DB: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(900),
    REFRESH_TOKEN_EXPIRES_IN_SECONDS: z.coerce
      .number()
      .int()
      .positive()
      .default(2592000),
    PORT: z.coerce.number().int().positive().default(3333),
    HOST: z.string().min(1).default("0.0.0.0"),
    SMTP_HOST: z.string().min(1).default("localhost"),
    SMTP_PORT: z.coerce.number().int().positive().default(1025),
    SMTP_SECURE: z.stringbool().default(false),
    SMTP_USER: z.string().min(1).optional(),
    SMTP_PASSWORD: z.string().min(1).optional(),
    SMTP_FROM: z
      .string()
      .min(1)
      .default('"Financial App" <no-reply@financial-app.local>'),
    EMAIL_PROVIDER: z.enum(["local", "resend"]).default("local"),
    RESEND_API_KEY: z.string().min(1).optional(),
    APP_URL: z.url().default("http://localhost:3000"),
    COOKIE_SECURE: z.stringbool().default(false),
  })
  .superRefine((val, ctx) => {
    if (val.EMAIL_PROVIDER === "resend" && !val.RESEND_API_KEY) {
      ctx.addIssue({
        code: "custom",
        path: ["RESEND_API_KEY"],
        message: "RESEND_API_KEY is required when EMAIL_PROVIDER=resend",
      });
    }
  });

export type IEnv = z.infer<typeof envSchema>;

export const env: IEnv = envSchema.parse(process.env);
