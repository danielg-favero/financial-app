import type { ISignOutDTO } from "@/modules/auth/dtos/auth-token.dto";
import type { LogoutUserService } from "@/modules/auth/services/logout-user.service";

export interface ILogoutUserUseCaseDeps {
  logoutUserService: LogoutUserService;
}

export class LogoutUserUseCase {
  private readonly logoutUserService: LogoutUserService;

  constructor({ logoutUserService }: ILogoutUserUseCaseDeps) {
    this.logoutUserService = logoutUserService;
  }

  async execute(dto: ISignOutDTO): Promise<void> {
    await this.logoutUserService.execute(dto);
  }
}
