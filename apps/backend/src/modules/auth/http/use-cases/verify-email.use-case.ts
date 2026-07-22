import type { User } from "@/modules/auth/domain/entities/user";
import type { IVerifyEmailDTO } from "@/modules/auth/dtos/verify-email.dto";
import type { VerifyEmailService } from "@/modules/auth/services/verify-email.service";

export interface IVerifyEmailUseCaseDeps {
  verifyEmailService: VerifyEmailService;
}

export class VerifyEmailUseCase {
  private readonly verifyEmailService: VerifyEmailService;

  constructor({ verifyEmailService }: IVerifyEmailUseCaseDeps) {
    this.verifyEmailService = verifyEmailService;
  }

  async execute(dto: IVerifyEmailDTO): Promise<User> {
    return this.verifyEmailService.execute(dto);
  }
}
