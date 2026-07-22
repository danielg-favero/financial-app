import type { FastifyReply } from "fastify";

import type { IAuthTokens } from "@/modules/auth/services/issue-auth-tokens.service";

export const AUTH_COOKIE_NAME = "accessToken";
export const REFRESH_COOKIE_NAME = "refreshToken";

export interface IAuthCookieOptions {
  secure: boolean;
  maxAgeSeconds: number;
  refreshMaxAgeSeconds: number;
}

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
} as const;

export function setAuthCookies(
  reply: FastifyReply,
  tokens: IAuthTokens,
  options: IAuthCookieOptions,
): void {
  reply.setCookie(AUTH_COOKIE_NAME, tokens.accessToken, {
    ...BASE_COOKIE_OPTIONS,
    secure: options.secure,
    maxAge: options.maxAgeSeconds,
  });
  reply.setCookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {
    ...BASE_COOKIE_OPTIONS,
    secure: options.secure,
    maxAge: options.refreshMaxAgeSeconds,
  });
}

export function clearAuthCookies(reply: FastifyReply, options: IAuthCookieOptions): void {
  reply.clearCookie(AUTH_COOKIE_NAME, {
    ...BASE_COOKIE_OPTIONS,
    secure: options.secure,
  });
  reply.clearCookie(REFRESH_COOKIE_NAME, {
    ...BASE_COOKIE_OPTIONS,
    secure: options.secure,
  });
}
