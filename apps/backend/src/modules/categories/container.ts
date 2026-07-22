import type { FastifyPluginAsync } from "fastify";

import type { AuthMiddleware } from "@/modules/auth/middlewares/auth.middleware";
import { CategoriesController } from "@/modules/categories/http/controllers/categories.controller";
import type { ICategoryRepository } from "@/modules/categories/repositories/category.repository";
import { buildCategoriesRoutes } from "@/modules/categories/http/routes/categories.routes";
import { CreateCategoryService } from "@/modules/categories/services/create-category.service";
import { DeleteCategoryService } from "@/modules/categories/services/delete-category.service";
import { GetCategoryService } from "@/modules/categories/services/get-category.service";
import { ListCategoriesService } from "@/modules/categories/services/list-categories.service";
import { UpdateCategoryService } from "@/modules/categories/services/update-category.service";
import { CreateCategoryUseCase } from "@/modules/categories/http/use-cases/create-category.use-case";
import { DeleteCategoryUseCase } from "@/modules/categories/http/use-cases/delete-category.use-case";
import { GetCategoryUseCase } from "@/modules/categories/http/use-cases/get-category.use-case";
import { ListCategoriesUseCase } from "@/modules/categories/http/use-cases/list-categories.use-case";
import { UpdateCategoryUseCase } from "@/modules/categories/http/use-cases/update-category.use-case";
import type { ListTransactionsService } from "@/modules/transactions/services/list-transactions.service";

export interface ICategoriesContainerDeps {
  categoryRepository: ICategoryRepository;
  authMiddleware: AuthMiddleware;
  /** Lazy to break the categories <-> transactions container construction cycle. */
  listTransactionsService: () => ListTransactionsService;
}

export class CategoriesContainer {
  readonly createCategoryService: CreateCategoryService;
  readonly listCategoriesService: ListCategoriesService;
  readonly getCategoryService: GetCategoryService;
  readonly updateCategoryService: UpdateCategoryService;
  readonly deleteCategoryService: DeleteCategoryService;

  readonly controller: CategoriesController;

  readonly #deps: ICategoriesContainerDeps;

  constructor(deps: ICategoriesContainerDeps) {
    this.#deps = deps;
    const { categoryRepository } = deps;
    this.createCategoryService = new CreateCategoryService({ categoryRepository });
    this.listCategoriesService = new ListCategoriesService({ categoryRepository });
    this.getCategoryService = new GetCategoryService({ categoryRepository });
    this.updateCategoryService = new UpdateCategoryService({ categoryRepository });
    this.deleteCategoryService = new DeleteCategoryService({ categoryRepository });

    this.controller = new CategoriesController({
      createCategoryUseCase: new CreateCategoryUseCase({
        createCategoryService: this.createCategoryService,
        getCategoryService: this.getCategoryService,
      }),
      listCategoriesUseCase: new ListCategoriesUseCase({
        listCategoriesService: this.listCategoriesService,
      }),
      getCategoryUseCase: new GetCategoryUseCase({ getCategoryService: this.getCategoryService }),
      updateCategoryUseCase: new UpdateCategoryUseCase({
        updateCategoryService: this.updateCategoryService,
        getCategoryService: this.getCategoryService,
      }),
      deleteCategoryUseCase: new DeleteCategoryUseCase({
        deleteCategoryService: this.deleteCategoryService,
        listCategoriesService: this.listCategoriesService,
        listTransactionsService: deps.listTransactionsService,
      }),
    });
  }

  get routes(): FastifyPluginAsync {
    return buildCategoriesRoutes({
      controller: this.controller,
      authMiddleware: this.#deps.authMiddleware,
    });
  }
}
