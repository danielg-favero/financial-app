import type { FastifyPluginAsync } from "fastify";

import type { AuthMiddleware } from "@/modules/auth/middlewares/auth.middleware";
import { LoansController } from "@/modules/loans/http/controllers/loans.controller";
import type { ILoanRepository } from "@/modules/loans/repositories/loan.repository";
import { buildLoansRoutes } from "@/modules/loans/http/routes/loans.routes";
import { CreateLoanService } from "@/modules/loans/services/create-loan.service";
import { DeleteLoanService } from "@/modules/loans/services/delete-loan.service";
import { GetLoanService } from "@/modules/loans/services/get-loan.service";
import { ListLoansService } from "@/modules/loans/services/list-loans.service";
import { UpdateLoanService } from "@/modules/loans/services/update-loan.service";
import { CreateLoanUseCase } from "@/modules/loans/http/use-cases/create-loan.use-case";
import { DeleteLoanUseCase } from "@/modules/loans/http/use-cases/delete-loan.use-case";
import { GetLoanUseCase } from "@/modules/loans/http/use-cases/get-loan.use-case";
import { ListLoansUseCase } from "@/modules/loans/http/use-cases/list-loans.use-case";
import { UpdateLoanUseCase } from "@/modules/loans/http/use-cases/update-loan.use-case";

export interface ILoansContainerDeps {
  loanRepository: ILoanRepository;
  authMiddleware: AuthMiddleware;
}

export class LoansContainer {
  readonly createLoanService: CreateLoanService;
  readonly listLoansService: ListLoansService;
  readonly getLoanService: GetLoanService;
  readonly updateLoanService: UpdateLoanService;
  readonly deleteLoanService: DeleteLoanService;

  readonly controller: LoansController;

  readonly #deps: ILoansContainerDeps;

  constructor(deps: ILoansContainerDeps) {
    this.#deps = deps;
    const { loanRepository } = deps;
    this.createLoanService = new CreateLoanService({ loanRepository });
    this.listLoansService = new ListLoansService({ loanRepository });
    this.getLoanService = new GetLoanService({ loanRepository });
    this.updateLoanService = new UpdateLoanService({ loanRepository });
    this.deleteLoanService = new DeleteLoanService({ loanRepository });

    this.controller = new LoansController({
      createLoanUseCase: new CreateLoanUseCase({ createLoanService: this.createLoanService }),
      listLoansUseCase: new ListLoansUseCase({ listLoansService: this.listLoansService }),
      getLoanUseCase: new GetLoanUseCase({ getLoanService: this.getLoanService }),
      updateLoanUseCase: new UpdateLoanUseCase({ updateLoanService: this.updateLoanService }),
      deleteLoanUseCase: new DeleteLoanUseCase({ deleteLoanService: this.deleteLoanService }),
    });
  }

  get routes(): FastifyPluginAsync {
    return buildLoansRoutes({ controller: this.controller, authMiddleware: this.#deps.authMiddleware });
  }
}
