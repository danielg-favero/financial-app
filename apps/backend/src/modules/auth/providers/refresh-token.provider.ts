import { createHash, randomBytes } from "node:crypto";

export interface IGeneratedRefreshToken {
  token: string;
  tokenHash: string;
}

export interface IRefreshTokenProvider {
  generate(): IGeneratedRefreshToken;
  hash(token: string): string;
}

export class CryptoRefreshTokenProvider implements IRefreshTokenProvider {
  generate(): IGeneratedRefreshToken {
    const token = randomBytes(32).toString("hex");
    return { token, tokenHash: this.hash(token) };
  }

  hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
