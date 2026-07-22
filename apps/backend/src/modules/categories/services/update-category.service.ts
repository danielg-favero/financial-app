import { Category, CategoryType } from "@/modules/categories/domain/entities/category";
import { CategoryNotFoundError } from "@/modules/categories/domain/errors/category-not-found.error";
import { InvalidExpenseKindError } from "@/modules/categories/domain/errors/invalid-expense-kind.error";
import type { IUpdateCategoryDTO } from "@/modules/categories/dtos/update-category.dto";
import type { ICategoryRepository } from "@/modules/categories/repositories/category.repository";

export interface IUpdateCategoryServiceDeps {
  categoryRepository: ICategoryRepository;
}

export class UpdateCategoryService {
  private readonly categoryRepository: ICategoryRepository;

  constructor({ categoryRepository }: IUpdateCategoryServiceDeps) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id: string, userId: string, dto: IUpdateCategoryDTO): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category || category.userId !== userId) {
      throw new CategoryNotFoundError();
    }

    const nextType = dto.type ?? category.type;
    const nextExpenseKind = dto.expenseKind !== undefined ? dto.expenseKind : category.expenseKind;
    if (nextExpenseKind && nextType !== CategoryType.DESPESA) {
      throw new InvalidExpenseKindError();
    }

    return this.categoryRepository.update(id, {
      name: dto.name,
      type: dto.type,
      expenseKind: dto.expenseKind !== undefined ? dto.expenseKind : undefined,
      parentId: dto.parentId !== undefined ? dto.parentId : undefined,
    });
  }
}
