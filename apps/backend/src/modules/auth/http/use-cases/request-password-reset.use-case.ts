import type { IForgotPasswordDTO } from "@/modules/auth/dtos/forgot-password.dto";
import type { RequestPasswordResetService } from "@/modules/auth/services/request-password-reset.service";

export interface IRequestPasswordResetUseCaseDeps {
  requestPasswordResetService: RequestPasswordResetService;
}

export class RequestPasswordResetUseCase {
  private readonly requestPasswordResetService: RequestPasswordResetService;

  constructor({ requestPasswordResetService }: IRequestPasswordResetUseCaseDeps) {
    this.requestPasswordResetService = requestPasswordResetService;
  }

  async execute(dto: IForgotPasswordDTO): Promise<void> {
    return this.requestPasswordResetService.execute(dto);
  }
}
