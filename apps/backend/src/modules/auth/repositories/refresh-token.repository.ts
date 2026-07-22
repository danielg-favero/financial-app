import type { RefreshToken } from "@/modules/auth/domain/entities/refresh-token";

export interface ICreateRefreshTokenData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface IRefreshTokenRepository {
  create(data: ICreateRefreshTokenData): Promise<RefreshToken>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  revoke(id: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
}
