import type { ISignOutDTO } from "@/modules/auth/dtos/auth-token.dto";
import type { IRefreshTokenProvider } from "@/modules/auth/providers/refresh-token.provider";
import type { ITokenDenylist } from "@/modules/auth/providers/token-denylist.provider";
import type { IRefreshTokenRepository } from "@/modules/auth/repositories/refresh-token.repository";

export interface ILogoutUserServiceDeps {
  tokenDenylist: ITokenDenylist;
  refreshTokenProvider: IRefreshTokenProvider;
  refreshTokenRepository: IRefreshTokenRepository;
}

export class LogoutUserService {
  private readonly tokenDenylist: ITokenDenylist;
  private readonly refreshTokenProvider: IRefreshTokenProvider;
  private readonly refreshTokenRepository: IRefreshTokenRepository;

  constructor({
    tokenDenylist,
    refreshTokenProvider,
    refreshTokenRepository,
  }: ILogoutUserServiceDeps) {
    this.tokenDenylist = tokenDenylist;
    this.refreshTokenProvider = refreshTokenProvider;
    this.refreshTokenRepository = refreshTokenRepository;
  }

  async execute(dto: ISignOutDTO): Promise<void> {
    this.tokenDenylist.revoke(dto.jti, dto.expiresAt);

    if (dto.refreshToken) {
      const tokenHash = this.refreshTokenProvider.hash(dto.refreshToken);
      const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);
      if (storedToken && !storedToken.isRevoked) {
        await this.refreshTokenRepository.revoke(storedToken.id);
      }
    }
  }
}
