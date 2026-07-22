import type { IResetPasswordDTO } from "@/modules/auth/dtos/reset-password.dto";
import type { ResetPasswordService } from "@/modules/auth/services/reset-password.service";

export interface IResetPasswordUseCaseDeps {
  resetPasswordService: ResetPasswordService;
}

export class ResetPasswordUseCase {
  private readonly resetPasswordService: ResetPasswordService;

  constructor({ resetPasswordService }: IResetPasswordUseCaseDeps) {
    this.resetPasswordService = resetPasswordService;
  }

  async execute(dto: IResetPasswordDTO): Promise<void> {
    return this.resetPasswordService.execute(dto);
  }
}
