import type { FastifyReply, FastifyRequest } from "fastify";

import type { CreateCategoryUseCase } from "@/modules/categories/http/use-cases/create-category.use-case";
import type { DeleteCategoryUseCase } from "@/modules/categories/http/use-cases/delete-category.use-case";
import type { GetCategoryUseCase } from "@/modules/categories/http/use-cases/get-category.use-case";
import type { ListCategoriesUseCase } from "@/modules/categories/http/use-cases/list-categories.use-case";
import type { UpdateCategoryUseCase } from "@/modules/categories/http/use-cases/update-category.use-case";
import { presentCategory } from "@/modules/categories/http/presenters/category.presenter";
import {
  createCategoriesBodySchema,
  listCategoriesQuerySchema,
  updateCategoryBodySchema,
} from "@/modules/categories/http/schemas/categories.schemas";
import { idParamsSchema, idsBodySchema } from "@/shared/http/schemas/common.schemas";

export interface ICategoriesControllerDeps {
  createCategoryUseCase: CreateCategoryUseCase;
  listCategoriesUseCase: ListCategoriesUseCase;
  getCategoryUseCase: GetCategoryUseCase;
  updateCategoryUseCase: UpdateCategoryUseCase;
  deleteCategoryUseCase: DeleteCategoryUseCase;
}

export class CategoriesController {
  private readonly createCategoryUseCase: CreateCategoryUseCase;
  private readonly listCategoriesUseCase: ListCategoriesUseCase;
  private readonly getCategoryUseCase: GetCategoryUseCase;
  private readonly updateCategoryUseCase: UpdateCategoryUseCase;
  private readonly deleteCategoryUseCase: DeleteCategoryUseCase;

  constructor({
    createCategoryUseCase,
    listCategoriesUseCase,
    getCategoryUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase,
  }: ICategoriesControllerDeps) {
    this.createCategoryUseCase = createCategoryUseCase;
    this.listCategoriesUseCase = listCategoriesUseCase;
    this.getCategoryUseCase = getCategoryUseCase;
    this.updateCategoryUseCase = updateCategoryUseCase;
    this.deleteCategoryUseCase = deleteCategoryUseCase;
  }

  readonly create = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = createCategoriesBodySchema.parse(request.body);
    const result = await this.createCategoryUseCase.executeMany(
      body.map((item) => ({
        userId: request.userId,
        name: item.name,
        type: item.type,
        expenseKind: item.expenseKind ?? null,
        parentId: item.parentId ?? null,
      })),
    );
    reply.status(200).send({
      created: result.created.map(presentCategory),
      failed: result.failed,
    });
  };

  readonly list = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = listCategoriesQuerySchema.parse(request.query);
    const result = await this.listCategoriesUseCase.execute(request.userId, query);
    reply.status(200).send({
      data: result.data.map(presentCategory),
      page: result.page,
      perPage: result.perPage,
      total: result.total,
      totalPages: result.totalPages,
    });
  };

  readonly get = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = idParamsSchema.parse(request.params);
    const category = await this.getCategoryUseCase.execute(params.id, request.userId);
    reply.status(200).send({ category: presentCategory(category) });
  };

  readonly update = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = idParamsSchema.parse(request.params);
    const body = updateCategoryBodySchema.parse(request.body);
    const category = await this.updateCategoryUseCase.execute(params.id, request.userId, body);
    reply.status(200).send({ category: presentCategory(category) });
  };

  readonly delete = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = idsBodySchema.parse(request.body);
    const result = await this.deleteCategoryUseCase.executeMany(body.ids, request.userId);
    reply.status(200).send(result);
  };
}
