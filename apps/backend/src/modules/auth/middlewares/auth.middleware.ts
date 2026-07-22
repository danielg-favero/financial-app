import type { FastifyReply, FastifyRequest } from "fastify";

import { InvalidTokenError } from "@/modules/auth/domain/errors/invalid-token.error";
import { AUTH_COOKIE_NAME } from "@/modules/auth/http/auth-cookie";
import type { ITokenDenylist } from "@/modules/auth/providers/token-denylist.provider";
import type { ITokenProvider } from "@/modules/auth/providers/token.provider";
import { UnauthorizedError } from "@/shared/errors/unauthorized.error";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
    tokenJti: string;
    tokenExpiresAt: number;
  }
}

const BEARER_PREFIX = "Bearer ";

export interface IAuthMiddlewareDeps {
  tokenProvider: ITokenProvider;
  tokenDenylist: ITokenDenylist;
}

export class AuthMiddleware {
  private readonly tokenProvider: ITokenProvider;
  private readonly tokenDenylist: ITokenDenylist;

  constructor({ tokenProvider, tokenDenylist }: IAuthMiddlewareDeps) {
    this.tokenProvider = tokenProvider;
    this.tokenDenylist = tokenDenylist;
  }

  readonly handle = async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedError("Missing authentication token");
    }

    const payload = this.tokenProvider.verify(token);

    if (this.tokenDenylist.isRevoked(payload.jti)) {
      throw new InvalidTokenError();
    }

    request.userId = payload.userId;
    request.tokenJti = payload.jti;
    request.tokenExpiresAt = payload.expiresAt;
  };

  private extractToken(request: FastifyRequest): string | undefined {
    const cookieToken = request.cookies[AUTH_COOKIE_NAME];
    if (cookieToken) {
      return cookieToken;
    }

    const authorization = request.headers.authorization;
    if (authorization?.startsWith(BEARER_PREFIX)) {
      return authorization.slice(BEARER_PREFIX.length);
    }

    return undefined;
  }
}
