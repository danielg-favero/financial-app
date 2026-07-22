import type { FastifyReply, FastifyRequest } from "fastify";

import type { CreateTransactionUseCase } from "@/modules/transactions/http/use-cases/create-transaction.use-case";
import type { DeleteTransactionUseCase } from "@/modules/transactions/http/use-cases/delete-transaction.use-case";
import type { GetTransactionUseCase } from "@/modules/transactions/http/use-cases/get-transaction.use-case";
import type { ListTransactionsUseCase } from "@/modules/transactions/http/use-cases/list-transactions.use-case";
import type { UpdateTransactionUseCase } from "@/modules/transactions/http/use-cases/update-transaction.use-case";
import { presentTransaction } from "@/modules/transactions/http/presenters/transaction.presenter";
import { idParamsSchema, idsBodySchema } from "@/shared/http/schemas/common.schemas";
import {
  createTransactionsBodySchema,
  listTransactionsQuerySchema,
  updateTransactionBodySchema,
} from "@/modules/transactions/http/schemas/transactions.schemas";

export interface ITransactionsControllerDeps {
  createTransactionUseCase: CreateTransactionUseCase;
  listTransactionsUseCase: ListTransactionsUseCase;
  getTransactionUseCase: GetTransactionUseCase;
  updateTransactionUseCase: UpdateTransactionUseCase;
  deleteTransactionUseCase: DeleteTransactionUseCase;
}

export class TransactionsController {
  private readonly createTransactionUseCase: CreateTransactionUseCase;
  private readonly listTransactionsUseCase: ListTransactionsUseCase;
  private readonly getTransactionUseCase: GetTransactionUseCase;
  private readonly updateTransactionUseCase: UpdateTransactionUseCase;
  private readonly deleteTransactionUseCase: DeleteTransactionUseCase;

  constructor({
    createTransactionUseCase,
    listTransactionsUseCase,
    getTransactionUseCase,
    updateTransactionUseCase,
    deleteTransactionUseCase,
  }: ITransactionsControllerDeps) {
    this.createTransactionUseCase = createTransactionUseCase;
    this.listTransactionsUseCase = listTransactionsUseCase;
    this.getTransactionUseCase = getTransactionUseCase;
    this.updateTransactionUseCase = updateTransactionUseCase;
    this.deleteTransactionUseCase = deleteTransactionUseCase;
  }

  readonly create = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = createTransactionsBodySchema.parse(request.body);
    const result = await this.createTransactionUseCase.executeMany(
      body.map((item) => ({
        userId: request.userId,
        categoryId: item.categoryId,
        description: item.description ?? null,
        amount: item.amount,
        referenceMonth: item.referenceMonth,
        referenceYear: item.referenceYear,
        transactionDate: new Date(item.transactionDate),
      })),
    );
    reply.status(200).send({
      created: result.created.map(presentTransaction),
      failed: result.failed,
    });
  };

  readonly list = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = listTransactionsQuerySchema.parse(request.query);
    const result = await this.listTransactionsUseCase.execute(request.userId, query);
    reply.status(200).send({
      data: result.data.map(presentTransaction),
      page: result.page,
      perPage: result.perPage,
      total: result.total,
      totalPages: result.totalPages,
    });
  };

  readonly get = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = idParamsSchema.parse(request.params);
    const transaction = await this.getTransactionUseCase.execute(params.id, request.userId);
    reply.status(200).send({ transaction: presentTransaction(transaction) });
  };

  readonly update = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = idParamsSchema.parse(request.params);
    const body = updateTransactionBodySchema.parse(request.body);
    const transaction = await this.updateTransactionUseCase.execute(params.id, request.userId, {
      categoryId: body.categoryId,
      description: body.description,
      amount: body.amount,
      referenceMonth: body.referenceMonth,
      referenceYear: body.referenceYear,
      transactionDate: body.transactionDate ? new Date(body.transactionDate) : undefined,
    });
    reply.status(200).send({ transaction: presentTransaction(transaction) });
  };

  readonly delete = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = idsBodySchema.parse(request.body);
    const result = await this.deleteTransactionUseCase.executeMany(body.ids, request.userId);
    reply.status(200).send(result);
  };
}
