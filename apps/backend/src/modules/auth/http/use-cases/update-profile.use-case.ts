import type { User } from "@/modules/auth/domain/entities/user";
import type { IUpdateProfileDTO } from "@/modules/auth/dtos/update-profile.dto";
import type { UpdateProfileService } from "@/modules/auth/services/update-profile.service";

export interface IUpdateProfileUseCaseDeps {
  updateProfileService: UpdateProfileService;
}

export class UpdateProfileUseCase {
  private readonly updateProfileService: UpdateProfileService;

  constructor({ updateProfileService }: IUpdateProfileUseCaseDeps) {
    this.updateProfileService = updateProfileService;
  }

  async execute(userId: string, dto: IUpdateProfileDTO): Promise<User> {
    return this.updateProfileService.execute(userId, dto);
  }
}
