import type { User } from "@/modules/auth/domain/entities/user";
import type { GetCurrentUserService } from "@/modules/auth/services/get-current-user.service";

export interface IGetCurrentUserUseCaseDeps {
  getCurrentUserService: GetCurrentUserService;
}

export class GetCurrentUserUseCase {
  private readonly getCurrentUserService: GetCurrentUserService;

  constructor({ getCurrentUserService }: IGetCurrentUserUseCaseDeps) {
    this.getCurrentUserService = getCurrentUserService;
  }

  async execute(userId: string): Promise<User> {
    return this.getCurrentUserService.execute(userId);
  }
}
