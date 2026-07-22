import type { ICreateUserDTO } from "@/modules/auth/dtos/create-user.dto";
import type {
  IRegisteredUser,
  RegisterUserService,
} from "@/modules/auth/services/register-user.service";

export interface IRegisterUserUseCaseDeps {
  registerUserService: RegisterUserService;
}

export class RegisterUserUseCase {
  private readonly registerUserService: RegisterUserService;

  constructor({ registerUserService }: IRegisterUserUseCaseDeps) {
    this.registerUserService = registerUserService;
  }

  async execute(dto: ICreateUserDTO): Promise<IRegisteredUser> {
    return this.registerUserService.execute(dto);
  }
}
