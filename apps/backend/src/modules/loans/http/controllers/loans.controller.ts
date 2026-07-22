import type { FastifyReply, FastifyRequest } from "fastify";

import type { CreateLoanUseCase } from "@/modules/loans/http/use-cases/create-loan.use-case";
import type { DeleteLoanUseCase } from "@/modules/loans/http/use-cases/delete-loan.use-case";
import type { GetLoanUseCase } from "@/modules/loans/http/use-cases/get-loan.use-case";
import type { ListLoansUseCase } from "@/modules/loans/http/use-cases/list-loans.use-case";
import type { UpdateLoanUseCase } from "@/modules/loans/http/use-cases/update-loan.use-case";
import { presentLoan } from "@/modules/loans/http/presenters/loan.presenter";
import { idParamsSchema, idsBodySchema } from "@/shared/http/schemas/common.schemas";
import {
  createLoansBodySchema,
  listLoansQuerySchema,
  updateLoanBodySchema,
} from "@/modules/loans/http/schemas/loans.schemas";

export interface ILoansControllerDeps {
  createLoanUseCase: CreateLoanUseCase;
  listLoansUseCase: ListLoansUseCase;
  getLoanUseCase: GetLoanUseCase;
  updateLoanUseCase: UpdateLoanUseCase;
  deleteLoanUseCase: DeleteLoanUseCase;
}

export class LoansController {
  private readonly createLoanUseCase: CreateLoanUseCase;
  private readonly listLoansUseCase: ListLoansUseCase;
  private readonly getLoanUseCase: GetLoanUseCase;
  private readonly updateLoanUseCase: UpdateLoanUseCase;
  private readonly deleteLoanUseCase: DeleteLoanUseCase;

  constructor({
    createLoanUseCase,
    listLoansUseCase,
    getLoanUseCase,
    updateLoanUseCase,
    deleteLoanUseCase,
  }: ILoansControllerDeps) {
    this.createLoanUseCase = createLoanUseCase;
    this.listLoansUseCase = listLoansUseCase;
    this.getLoanUseCase = getLoanUseCase;
    this.updateLoanUseCase = updateLoanUseCase;
    this.deleteLoanUseCase = deleteLoanUseCase;
  }

  readonly create = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = createLoansBodySchema.parse(request.body);
    const result = await this.createLoanUseCase.executeMany(
      body.map((item) => ({
        userId: request.userId,
        loanDate: new Date(item.loanDate),
        personName: item.personName,
        description: item.description,
        amountLent: item.amountLent,
        amountReceived: item.amountReceived,
      })),
    );
    reply.status(200).send({
      created: result.created.map(presentLoan),
      failed: result.failed,
    });
  };

  readonly list = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const query = listLoansQuerySchema.parse(request.query);
    const result = await this.listLoansUseCase.execute(request.userId, query);
    reply.status(200).send({
      data: result.data.map(presentLoan),
      page: result.page,
      perPage: result.perPage,
      total: result.total,
      totalPages: result.totalPages,
    });
  };

  readonly get = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const params = idParamsSchema.parse(request.params);
    const loan = await this.getLoanUseCase.execute(params.id, request.userId);
    reply.status(200).send({ loan: presentLoan(loan) });
  };

  readonly update = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const params = idParamsSchema.parse(request.params);
    const body = updateLoanBodySchema.parse(request.body);
    const loan = await this.updateLoanUseCase.execute(
      params.id,
      request.userId,
      {
        loanDate: body.loanDate ? new Date(body.loanDate) : undefined,
        personName: body.personName,
        description: body.description,
        amountLent: body.amountLent,
        amountReceived: body.amountReceived,
      },
    );
    reply.status(200).send({ loan: presentLoan(loan) });
  };

  readonly delete = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    const body = idsBodySchema.parse(request.body);
    const result = await this.deleteLoanUseCase.executeMany(body.ids, request.userId);
    reply.status(200).send(result);
  };
}
