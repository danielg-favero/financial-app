import type { ISignInDTO } from "@/modules/auth/dtos/sign-in.dto";
import type {
  IAuthenticatedUser,
  LoginUserService,
} from "@/modules/auth/services/login-user.service";

export interface ILoginUserUseCaseDeps {
  loginUserService: LoginUserService;
}

export class LoginUserUseCase {
  private readonly loginUserService: LoginUserService;

  constructor({ loginUserService }: ILoginUserUseCaseDeps) {
    this.loginUserService = loginUserService;
  }

  async execute(dto: ISignInDTO): Promise<IAuthenticatedUser> {
    return this.loginUserService.execute(dto);
  }
}
