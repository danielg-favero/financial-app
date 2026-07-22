import { InvalidTokenError } from "@/modules/auth/domain/errors/invalid-token.error";
import type { IRefreshTokenProvider } from "@/modules/auth/providers/refresh-token.provider";
import type { IRefreshTokenRepository } from "@/modules/auth/repositories/refresh-token.repository";
import type {
  IAuthTokens,
  IssueAuthTokensService,
} from "@/modules/auth/services/issue-auth-tokens.service";

export interface IRefreshSessionServiceDeps {
  refreshTokenProvider: IRefreshTokenProvider;
  refreshTokenRepository: IRefreshTokenRepository;
  issueAuthTokensService: IssueAuthTokensService;
}

export class RefreshSessionService {
  private readonly refreshTokenProvider: IRefreshTokenProvider;
  private readonly refreshTokenRepository: IRefreshTokenRepository;
  private readonly issueAuthTokensService: IssueAuthTokensService;

  constructor({
    refreshTokenProvider,
    refreshTokenRepository,
    issueAuthTokensService,
  }: IRefreshSessionServiceDeps) {
    this.refreshTokenProvider = refreshTokenProvider;
    this.refreshTokenRepository = refreshTokenRepository;
    this.issueAuthTokensService = issueAuthTokensService;
  }

  async execute(refreshToken: string): Promise<IAuthTokens> {
    const tokenHash = this.refreshTokenProvider.hash(refreshToken);
    const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new InvalidTokenError();
    }

    if (storedToken.isRevoked) {
      // A revoked token being replayed means it may have been stolen:
      // invalidate every session for the user
      await this.refreshTokenRepository.revokeAllByUserId(storedToken.userId);
      throw new InvalidTokenError();
    }

    if (storedToken.isExpired) {
      throw new InvalidTokenError();
    }

    await this.refreshTokenRepository.revoke(storedToken.id);

    return this.issueAuthTokensService.execute(storedToken.userId);
  }
}
