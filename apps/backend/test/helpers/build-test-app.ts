import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";

import { buildApp, type IRepositories } from "@/app";
import type { IEmailSender } from "@/shared/email/email-sender.provider";
import { InMemoryEmailSender } from "./in-memory-email-sender.ts";
import { createInMemoryRepositories } from "./in-memory-repositories.ts";

export interface ITestApp {
  app: FastifyInstance;
  repositories: IRepositories;
  emailSender: InMemoryEmailSender;
}

export interface IBuildTestAppOptions {
  emailSender?: IEmailSender;
}

export function buildTestApp(options?: IBuildTestAppOptions): ITestApp {
  const repositories = createInMemoryRepositories();
  const emailSender = new InMemoryEmailSender();
  const app = buildApp({
    repositories,
    emailSender: options?.emailSender ?? emailSender,
    auth: {
      jwtSecret: "test-secret",
      jwtExpiresInSeconds: 3600,
      refreshTokenExpiresInSeconds: 86400,
      appUrl: "http://localhost:3000",
      cookieSecure: false,
    },
  });
  return { app, repositories, emailSender };
}

export interface IAuthenticatedTestUser {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
}

export async function registerAndSignIn(app: FastifyInstance): Promise<IAuthenticatedTestUser> {
  const email = `user-${randomUUID()}@example.com`;
  const password = "Super-secret-password1";

  const signUpResponse = await app.inject({
    method: "POST",
    url: "/api/auth/signup",
    payload: { email, password, confirmPassword: password, firstName: "Test", lastName: "User" },
  });
  const signUpBody = signUpResponse.json();

  await app.inject({
    method: "POST",
    url: "/api/auth/verify-email",
    payload: { token: signUpBody.verificationToken },
  });

  const signInResponse = await app.inject({
    method: "POST",
    url: "/api/auth/signin",
    payload: { email, password },
  });

  return {
    accessToken: extractAuthCookie(signInResponse.cookies),
    refreshToken: extractRefreshCookie(signInResponse.cookies),
    userId: signUpBody.user.id,
    email,
  };
}

export interface IInjectedCookie {
  name: string;
  value: string;
}

export function extractAuthCookie(cookies: IInjectedCookie[]): string {
  return extractCookie(cookies, "accessToken");
}

export function extractRefreshCookie(cookies: IInjectedCookie[]): string {
  return extractCookie(cookies, "refreshToken");
}

function extractCookie(cookies: IInjectedCookie[], name: string): string {
  const cookie = cookies.find((candidate) => candidate.name === name);
  if (!cookie) {
    throw new Error(`${name} cookie not set on the response`);
  }
  return cookie.value;
}

export function authHeaders(accessToken: string): Record<string, string> {
  return { authorization: `Bearer ${accessToken}` };
}
