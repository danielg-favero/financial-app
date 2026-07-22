import type { Prisma, PrismaClient, Category as CategoryModel } from "@/generated/prisma/client";
import { Category } from "@/modules/categories/domain/entities/category";
import type { IListCategoriesFilterDTO } from "@/modules/categories/dtos/list-categories-filter.dto";
import type {
  ICategoryRepository,
  ICreateCategoryData,
  IUpdateCategoryData,
} from "@/modules/categories/repositories/category.repository";
import type { IFilteredResult } from "@/shared/filters/filtered-result";

export interface IPrismaCategoryRepositoryDeps {
  prisma: PrismaClient;
}

export class PrismaCategoryRepository implements ICategoryRepository {
  private readonly prisma: PrismaClient;

  constructor({ prisma }: IPrismaCategoryRepositoryDeps) {
    this.prisma = prisma;
  }

  async create(data: ICreateCategoryData): Promise<Category> {
    const record = await this.prisma.category.create({ data });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Category | null> {
    const record = await this.prisma.category.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async findManyByUserId(
    userId: string,
    filter: IListCategoriesFilterDTO,
  ): Promise<IFilteredResult<Category>> {
    const where: Prisma.CategoryWhereInput = {
      userId,
      parentId: filter.filters?.parentId,
      ...(filter.search !== undefined
        ? { name: { contains: filter.search, mode: "insensitive" } }
        : {}),
    };
    const orderBy =
      filter.orderBy !== undefined
        ? ({ [filter.orderBy]: filter.sort } as Prisma.CategoryOrderByWithRelationInput)
        : ({ createdAt: "asc" } as const);
    const [records, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy,
        skip: (filter.page - 1) * filter.perPage,
        take: filter.perPage,
      }),
      this.prisma.category.count({ where }),
    ]);
    return {
      data: records.map((record) => this.toEntity(record)),
      page: filter.page,
      perPage: filter.perPage,
      total,
      totalPages: Math.ceil(total / filter.perPage),
    };
  }

  async update(id: string, data: IUpdateCategoryData): Promise<Category> {
    const record = await this.prisma.category.update({ where: { id }, data });
    return this.toEntity(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  private toEntity(record: CategoryModel): Category {
    return new Category({
      id: record.id,
      userId: record.userId,
      parentId: record.parentId,
      name: record.name,
      type: record.type,
      expenseKind: record.expenseKind,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
