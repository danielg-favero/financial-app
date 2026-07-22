import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:3333/api"),
});

export type IEnv = z.infer<typeof envSchema>;

export const env: IEnv = envSchema.parse({
  // NEXT_PUBLIC_* vars must be referenced statically so Next.js can inline them
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
