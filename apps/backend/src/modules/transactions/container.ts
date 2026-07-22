import type { FastifyPluginAsync } from "fastify";

import type { AuthMiddleware } from "@/modules/auth/middlewares/auth.middleware";
import type { GetCategoryService } from "@/modules/categories/services/get-category.service";
import { TransactionsController } from "@/modules/transactions/http/controllers/transactions.controller";
import type { ITransactionRepository } from "@/modules/transactions/repositories/transaction.repository";
import { buildTransactionsRoutes } from "@/modules/transactions/http/routes/transactions.routes";
import { CreateTransactionService } from "@/modules/transactions/services/create-transaction.service";
import { DeleteTransactionService } from "@/modules/transactions/services/delete-transaction.service";
import { GetTransactionService } from "@/modules/transactions/services/get-transaction.service";
import { ListTransactionsService } from "@/modules/transactions/services/list-transactions.service";
import { UpdateTransactionService } from "@/modules/transactions/services/update-transaction.service";
import { CreateTransactionUseCase } from "@/modules/transactions/http/use-cases/create-transaction.use-case";
import { DeleteTransactionUseCase } from "@/modules/transactions/http/use-cases/delete-transaction.use-case";
import { GetTransactionUseCase } from "@/modules/transactions/http/use-cases/get-transaction.use-case";
import { ListTransactionsUseCase } from "@/modules/transactions/http/use-cases/list-transactions.use-case";
import { UpdateTransactionUseCase } from "@/modules/transactions/http/use-cases/update-transaction.use-case";

export interface ITransactionsContainerDeps {
  transactionRepository: ITransactionRepository;
  authMiddleware: AuthMiddleware;
  getCategoryService: GetCategoryService;
}

export class TransactionsContainer {
  readonly createTransactionService: CreateTransactionService;
  readonly listTransactionsService: ListTransactionsService;
  readonly getTransactionService: GetTransactionService;
  readonly updateTransactionService: UpdateTransactionService;
  readonly deleteTransactionService: DeleteTransactionService;

  readonly controller: TransactionsController;

  readonly #deps: ITransactionsContainerDeps;

  constructor(deps: ITransactionsContainerDeps) {
    this.#deps = deps;
    const { transactionRepository, getCategoryService } = deps;
    this.createTransactionService = new CreateTransactionService({ transactionRepository });
    this.listTransactionsService = new ListTransactionsService({ transactionRepository });
    this.getTransactionService = new GetTransactionService({ transactionRepository });
    this.updateTransactionService = new UpdateTransactionService({ transactionRepository });
    this.deleteTransactionService = new DeleteTransactionService({ transactionRepository });

    this.controller = new TransactionsController({
      createTransactionUseCase: new CreateTransactionUseCase({
        createTransactionService: this.createTransactionService,
        getCategoryService,
      }),
      listTransactionsUseCase: new ListTransactionsUseCase({
        listTransactionsService: this.listTransactionsService,
      }),
      getTransactionUseCase: new GetTransactionUseCase({
        getTransactionService: this.getTransactionService,
      }),
      updateTransactionUseCase: new UpdateTransactionUseCase({
        updateTransactionService: this.updateTransactionService,
        getCategoryService,
      }),
      deleteTransactionUseCase: new DeleteTransactionUseCase({
        deleteTransactionService: this.deleteTransactionService,
      }),
    });
  }

  get routes(): FastifyPluginAsync {
    return buildTransactionsRoutes({
      controller: this.controller,
      authMiddleware: this.#deps.authMiddleware,
    });
  }
}
