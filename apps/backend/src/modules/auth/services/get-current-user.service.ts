import type { User } from "@/modules/auth/domain/entities/user";
import { UserNotFoundError } from "@/modules/auth/domain/errors/user-not-found.error";
import type { IUserRepository } from "@/modules/auth/repositories/user.repository";

export interface IGetCurrentUserServiceDeps {
  userRepository: IUserRepository;
}

export class GetCurrentUserService {
  private readonly userRepository: IUserRepository;

  constructor({ userRepository }: IGetCurrentUserServiceDeps) {
    this.userRepository = userRepository;
  }

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }
}
