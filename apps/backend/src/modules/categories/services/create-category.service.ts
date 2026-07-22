import { Category, CategoryType } from "@/modules/categories/domain/entities/category";
import { InvalidExpenseKindError } from "@/modules/categories/domain/errors/invalid-expense-kind.error";
import type { ICreateCategoryDTO } from "@/modules/categories/dtos/create-category.dto";
import type { ICategoryRepository } from "@/modules/categories/repositories/category.repository";

export interface ICreateCategoryServiceDeps {
  categoryRepository: ICategoryRepository;
}

export class CreateCategoryService {
  private readonly categoryRepository: ICategoryRepository;

  constructor({ categoryRepository }: ICreateCategoryServiceDeps) {
    this.categoryRepository = categoryRepository;
  }

  async execute(dto: ICreateCategoryDTO): Promise<Category> {
    if (dto.expenseKind && dto.type !== CategoryType.DESPESA) {
      throw new InvalidExpenseKindError();
    }

    return this.categoryRepository.create({
      userId: dto.userId,
      name: dto.name,
      type: dto.type,
      expenseKind: dto.expenseKind ?? null,
      parentId: dto.parentId ?? null,
    });
  }
}
