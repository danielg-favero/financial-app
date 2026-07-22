import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { Transaction } from "@/modules/transactions/domain/entities/transaction";
import type { IListTransactionsFilterDTO } from "@/modules/transactions/dtos/list-transactions-filter.dto";
import type {
  ICreateTransactionData,
  ITransactionRepository,
  IUpdateTransactionData,
} from "@/modules/transactions/repositories/transaction.repository";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

const withCategory = { category: true } satisfies Prisma.TransactionInclude;

type TransactionWithCategory = Prisma.TransactionGetPayload<{ include: typeof withCategory }>;

export interface IPrismaTransactionRepositoryDeps {
  prisma: PrismaClient;
}

export class PrismaTransactionRepository implements ITransactionRepository {
  private readonly prisma: PrismaClient;

  constructor({ prisma }: IPrismaTransactionRepositoryDeps) {
    this.prisma = prisma;
  }

  async create(data: ICreateTransactionData): Promise<Transaction> {
    const record = await this.prisma.transaction.create({ data, include: withCategory });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Transaction | null> {
    const record = await this.prisma.transaction.findUnique({
      where: { id },
      include: withCategory,
    });
    return record ? this.toEntity(record) : null;
  }

  async findManyByUserId(
    userId: string,
    filter: IListTransactionsFilterDTO,
  ): Promise<IFilteredResult<Transaction>> {
    const where: Prisma.TransactionWhereInput = {
      userId,
      categoryId: filter.filters?.categoryId,
      referenceMonth: filter.filters?.referenceMonth,
      referenceYear: filter.filters?.referenceYear,
      category: {
        type: filter.filters?.categoryType,
        expenseKind: filter.filters?.expenseKind,
      },
      ...(filter.search !== undefined
        ? {
            OR: [
              { description: { contains: filter.search, mode: "insensitive" } },
              {
                category: {
                  name: { contains: filter.search, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    };
    const orderBy =
      filter.orderBy !== undefined
        ? ({ [filter.orderBy]: filter.sort } as Prisma.TransactionOrderByWithRelationInput)
        : ({ transactionDate: "desc" } as const);
    const [records, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        orderBy,
        skip: (filter.page - 1) * filter.perPage,
        take: filter.perPage,
        include: withCategory,
      }),
      this.prisma.transaction.count({ where }),
    ]);
    return {
      data: records.map((record) => this.toEntity(record)),
      page: filter.page,
      perPage: filter.perPage,
      total,
      totalPages: Math.ceil(total / filter.perPage),
    };
  }

  async update(id: string, data: IUpdateTransactionData): Promise<Transaction> {
    const record = await this.prisma.transaction.update({
      where: { id },
      data,
      include: withCategory,
    });
    return this.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({ where: { id } });
  }

  private toEntity(record: TransactionWithCategory): Transaction {
    return new Transaction({
      id: record.id,
      userId: record.userId,
      categoryId: record.categoryId,
      description: record.description,
      amount: Number(record.amount),
      referenceMonth: record.referenceMonth,
      referenceYear: record.referenceYear,
      transactionDate: record.transactionDate,
      category: {
        id: record.category.id,
        name: record.category.name,
        type: record.category.type,
        expenseKind: record.category.expenseKind,
      },
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
