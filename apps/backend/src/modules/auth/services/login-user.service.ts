import type { User } from "@/modules/auth/domain/entities/user";
import { EmailNotVerifiedError } from "@/modules/auth/domain/errors/email-not-verified.error";
import { InvalidCredentialsError } from "@/modules/auth/domain/errors/invalid-credentials.error";
import type { ISignInDTO } from "@/modules/auth/dtos/sign-in.dto";
import type { IPasswordHasher } from "@/modules/auth/providers/password-hasher.provider";
import type { IUserRepository } from "@/modules/auth/repositories/user.repository";
import type { IssueAuthTokensService } from "@/modules/auth/services/issue-auth-tokens.service";

export interface IAuthenticatedUser {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ILoginUserServiceDeps {
  userRepository: IUserRepository;
  passwordHasher: IPasswordHasher;
  issueAuthTokensService: IssueAuthTokensService;
}

export class LoginUserService {
  private readonly userRepository: IUserRepository;
  private readonly passwordHasher: IPasswordHasher;
  private readonly issueAuthTokensService: IssueAuthTokensService;

  constructor({
    userRepository,
    passwordHasher,
    issueAuthTokensService,
  }: ILoginUserServiceDeps) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.issueAuthTokensService = issueAuthTokensService;
  }

  async execute(dto: ISignInDTO): Promise<IAuthenticatedUser> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    if (!user.emailVerified) {
      throw new EmailNotVerifiedError();
    }

    const { accessToken, refreshToken } = await this.issueAuthTokensService.execute(user.id);

    return { user, accessToken, refreshToken };
  }
}
