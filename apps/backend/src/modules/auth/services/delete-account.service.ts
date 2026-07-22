import { UserNotFoundError } from "@/modules/auth/domain/errors/user-not-found.error";
import type { IDeleteAccountDTO } from "@/modules/auth/dtos/delete-account.dto";
import type { ITokenDenylist } from "@/modules/auth/providers/token-denylist.provider";
import type { IRefreshTokenRepository } from "@/modules/auth/repositories/refresh-token.repository";
import type { IUserRepository } from "@/modules/auth/repositories/user.repository";

export interface IDeleteAccountServiceDeps {
  userRepository: IUserRepository;
  refreshTokenRepository: IRefreshTokenRepository;
  tokenDenylist: ITokenDenylist;
}

export class DeleteAccountService {
  private readonly userRepository: IUserRepository;
  private readonly refreshTokenRepository: IRefreshTokenRepository;
  private readonly tokenDenylist: ITokenDenylist;

  constructor({
    userRepository,
    refreshTokenRepository,
    tokenDenylist,
  }: IDeleteAccountServiceDeps) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.tokenDenylist = tokenDenylist;
  }

  async execute(dto: IDeleteAccountDTO): Promise<void> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    await this.refreshTokenRepository.revokeAllByUserId(dto.userId);
    this.tokenDenylist.revoke(dto.jti, dto.expiresAt);
    await this.userRepository.delete(dto.userId);
  }
}
