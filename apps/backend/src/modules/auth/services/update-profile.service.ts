import type { User } from "@/modules/auth/domain/entities/user";
import { EmailAlreadyInUseError } from "@/modules/auth/domain/errors/email-already-in-use.error";
import { UserNotFoundError } from "@/modules/auth/domain/errors/user-not-found.error";
import type { IUpdateProfileDTO } from "@/modules/auth/dtos/update-profile.dto";
import type { IUserRepository } from "@/modules/auth/repositories/user.repository";

export interface IUpdateProfileServiceDeps {
  userRepository: IUserRepository;
}

export class UpdateProfileService {
  private readonly userRepository: IUserRepository;

  constructor({ userRepository }: IUpdateProfileServiceDeps) {
    this.userRepository = userRepository;
  }

  async execute(userId: string, dto: IUpdateProfileDTO): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    if (dto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new EmailAlreadyInUseError();
      }
    }

    return this.userRepository.update(userId, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
    });
  }
}
