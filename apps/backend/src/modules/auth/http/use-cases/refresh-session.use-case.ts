import type { IAuthTokens } from "@/modules/auth/services/issue-auth-tokens.service";
import type { RefreshSessionService } from "@/modules/auth/services/refresh-session.service";

export interface IRefreshSessionUseCaseDeps {
  refreshSessionService: RefreshSessionService;
}

export class RefreshSessionUseCase {
  private readonly refreshSessionService: RefreshSessionService;

  constructor({ refreshSessionService }: IRefreshSessionUseCaseDeps) {
    this.refreshSessionService = refreshSessionService;
  }

  async execute(refreshToken: string): Promise<IAuthTokens> {
    return this.refreshSessionService.execute(refreshToken);
  }
}
