import type {
  PrismaClient,
  RefreshToken as RefreshTokenModel,
} from "@/generated/prisma/client";
import { RefreshToken } from "@/modules/auth/domain/entities/refresh-token";
import type {
  ICreateRefreshTokenData,
  IRefreshTokenRepository,
} from "@/modules/auth/repositories/refresh-token.repository";

export interface IPrismaRefreshTokenRepositoryDeps {
  prisma: PrismaClient;
}

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  private readonly prisma: PrismaClient;

  constructor({ prisma }: IPrismaRefreshTokenRepositoryDeps) {
    this.prisma = prisma;
  }

  async create(data: ICreateRefreshTokenData): Promise<RefreshToken> {
    const record = await this.prisma.refreshToken.create({ data });
    return this.toEntity(record);
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
    return record ? this.toEntity(record) : null;
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private toEntity(record: RefreshTokenModel): RefreshToken {
    return new RefreshToken({
      id: record.id,
      userId: record.userId,
      tokenHash: record.tokenHash,
      expiresAt: record.expiresAt,
      revokedAt: record.revokedAt,
      createdAt: record.createdAt,
    });
  }
}
