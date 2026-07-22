import type { Prisma, PrismaClient, Loan as LoanModel } from "@/generated/prisma/client";
import { Loan } from "@/modules/loans/domain/entities/loan";
import type { IListLoansFilterDTO } from "@/modules/loans/dtos/list-loans-filter.dto";
import type { ICreateLoanData, ILoanRepository, IUpdateLoanData } from "@/modules/loans/repositories/loan.repository";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

export interface IPrismaLoanRepositoryDeps {
  prisma: PrismaClient;
}

export class PrismaLoanRepository implements ILoanRepository {
  private readonly prisma: PrismaClient;

  constructor({ prisma }: IPrismaLoanRepositoryDeps) {
    this.prisma = prisma;
  }

  async create(data: ICreateLoanData): Promise<Loan> {
    const record = await this.prisma.loan.create({ data });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Loan | null> {
    const record = await this.prisma.loan.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async findManyByUserId(
    userId: string,
    filter: IListLoansFilterDTO,
  ): Promise<IFilteredResult<Loan>> {
    const where: Prisma.LoanWhereInput = {
      userId,
      ...(filter.search !== undefined
        ? {
            OR: [
              { personName: { contains: filter.search, mode: "insensitive" } },
              { description: { contains: filter.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const orderBy =
      filter.orderBy !== undefined
        ? ({ [filter.orderBy]: filter.sort } as Prisma.LoanOrderByWithRelationInput)
        : ({ loanDate: "desc" } as const);
    const [records, total] = await Promise.all([
      this.prisma.loan.findMany({
        where,
        orderBy,
        skip: (filter.page - 1) * filter.perPage,
        take: filter.perPage,
      }),
      this.prisma.loan.count({ where }),
    ]);
    return {
      data: records.map((record) => this.toEntity(record)),
      page: filter.page,
      perPage: filter.perPage,
      total,
      totalPages: Math.ceil(total / filter.perPage),
    };
  }

  async update(id: string, data: IUpdateLoanData): Promise<Loan> {
    const record = await this.prisma.loan.update({ where: { id }, data });
    return this.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.loan.delete({ where: { id } });
  }

  private toEntity(record: LoanModel): Loan {
    return new Loan({
      id: record.id,
      userId: record.userId,
      loanDate: record.loanDate,
      personName: record.personName,
      description: record.description,
      amountLent: Number(record.amountLent),
      amountReceived: Number(record.amountReceived),
      openBalance: Number(record.openBalance),
      isPaid: record.isPaid,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
