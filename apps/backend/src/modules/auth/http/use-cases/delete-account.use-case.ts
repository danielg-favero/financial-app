import type { IDeleteAccountDTO } from "@/modules/auth/dtos/delete-account.dto";
import type { DeleteAccountService } from "@/modules/auth/services/delete-account.service";

export interface IDeleteAccountUseCaseDeps {
  deleteAccountService: DeleteAccountService;
}

export class DeleteAccountUseCase {
  private readonly deleteAccountService: DeleteAccountService;

  constructor({ deleteAccountService }: IDeleteAccountUseCaseDeps) {
    this.deleteAccountService = deleteAccountService;
  }

  async execute(dto: IDeleteAccountDTO): Promise<void> {
    return this.deleteAccountService.execute(dto);
  }
}
