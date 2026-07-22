import type { IRefreshTokenProvider } from "@/modules/auth/providers/refresh-token.provider";
import type { ITokenProvider } from "@/modules/auth/providers/token.provider";
import type { IRefreshTokenRepository } from "@/modules/auth/repositories/refresh-token.repository";

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IIssueAuthTokensServiceDeps {
  tokenProvider: ITokenProvider;
  refreshTokenProvider: IRefreshTokenProvider;
  refreshTokenRepository: IRefreshTokenRepository;
  refreshTokenExpiresInSeconds: number;
}

export class IssueAuthTokensService {
  private readonly tokenProvider: ITokenProvider;
  private readonly refreshTokenProvider: IRefreshTokenProvider;
  private readonly refreshTokenRepository: IRefreshTokenRepository;
  private readonly refreshTokenExpiresInSeconds: number;

  constructor({
    tokenProvider,
    refreshTokenProvider,
    refreshTokenRepository,
    refreshTokenExpiresInSeconds,
  }: IIssueAuthTokensServiceDeps) {
    this.tokenProvider = tokenProvider;
    this.refreshTokenProvider = refreshTokenProvider;
    this.refreshTokenRepository = refreshTokenRepository;
    this.refreshTokenExpiresInSeconds = refreshTokenExpiresInSeconds;
  }

  async execute(userId: string): Promise<IAuthTokens> {
    const accessToken = this.tokenProvider.sign(userId);
    const { token, tokenHash } = this.refreshTokenProvider.generate();

    await this.refreshTokenRepository.create({
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + this.refreshTokenExpiresInSeconds * 1000),
    });

    return { accessToken, refreshToken: token };
  }
}
