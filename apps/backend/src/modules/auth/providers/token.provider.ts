import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";

import type { IAuthTokenPayloadDTO } from "@/modules/auth/dtos/auth-token.dto";
import { InvalidTokenError } from "@/modules/auth/domain/errors/invalid-token.error";

export interface ITokenProvider {
  sign(userId: string): string;
  verify(token: string): IAuthTokenPayloadDTO;
}

export interface IJwtTokenProviderDeps {
  secret: string;
  expiresInSeconds: number;
}

export class JwtTokenProvider implements ITokenProvider {
  private readonly secret: string;
  private readonly expiresInSeconds: number;

  constructor({ secret, expiresInSeconds }: IJwtTokenProviderDeps) {
    this.secret = secret;
    this.expiresInSeconds = expiresInSeconds;
  }

  sign(userId: string): string {
    return jwt.sign({}, this.secret, {
      subject: userId,
      jwtid: randomUUID(),
      expiresIn: this.expiresInSeconds,
    });
  }

  verify(token: string): IAuthTokenPayloadDTO {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (
        typeof decoded === "string" ||
        typeof decoded.sub !== "string" ||
        typeof decoded.jti !== "string" ||
        typeof decoded.exp !== "number"
      ) {
        throw new InvalidTokenError();
      }
      return {
        userId: decoded.sub,
        jti: decoded.jti,
        expiresAt: decoded.exp * 1000,
      };
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw error;
      }
      throw new InvalidTokenError();
    }
  }
}
