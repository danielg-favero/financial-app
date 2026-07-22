import { randomUUID } from "node:crypto";

import type { IRepositories } from "@/app";
import { RefreshToken } from "@/modules/auth/domain/entities/refresh-token";
import { User } from "@/modules/auth/domain/entities/user";
import type {
  ICreateRefreshTokenData,
  IRefreshTokenRepository,
} from "@/modules/auth/repositories/refresh-token.repository";
import type {
  ICreateUserData,
  IUpdateUserData,
  IUserRepository,
} from "@/modules/auth/repositories/user.repository";
import { Category } from "@/modules/categories/domain/entities/category";
import type { IListCategoriesFilterDTO } from "@/modules/categories/dtos/list-categories-filter.dto";
import type {
  ICategoryRepository,
  ICreateCategoryData,
  IUpdateCategoryData,
} from "@/modules/categories/repositories/category.repository";
import type { IListLoansFilterDTO } from "@/modules/loans/dtos/list-loans-filter.dto";
import type { IFilteredResult } from "@/shared/filters/filtered-result";
import { listFilters } from "@/shared/filters/list-filters";
import { Loan } from "@/modules/loans/domain/entities/loan";
import type {
  ICreateLoanData,
  ILoanRepository,
  IUpdateLoanData,
} from "@/modules/loans/repositories/loan.repository";
import { Transaction } from "@/modules/transactions/domain/entities/transaction";
import type { IListTransactionsFilterDTO } from "@/modules/transactions/dtos/list-transactions-filter.dto";
import type {
  ICreateTransactionData,
  ITransactionRepository,
  IUpdateTransactionData,
} from "@/modules/transactions/repositories/transaction.repository";

export class InMemoryUserRepository implements IUserRepository {
  private readonly users = new Map<string, User>();

  async create(data: ICreateUserData): Promise<User> {
    const now = new Date();
    const user = new User({
      id: randomUUID(),
      email: data.email,
      passwordHash: data.passwordHash,
      emailVerified: false,
      firstName: data.firstName,
      lastName: data.lastName,
      verificationToken: data.verificationToken,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      createdAt: now,
      updatedAt: now,
    });
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.verificationToken === token) {
        return user;
      }
    }
    return null;
  }

  async findByPasswordResetToken(token: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.passwordResetToken === token) {
        return user;
      }
    }
    return null;
  }

  async update(id: string, data: IUpdateUserData): Promise<User> {
    const existing = this.users.get(id);
    if (!existing) {
      throw new Error(`User ${id} not found`);
    }
    const updated = new User({
      id: existing.id,
      email: data.email ?? existing.email,
      passwordHash: data.passwordHash ?? existing.passwordHash,
      emailVerified: data.emailVerified ?? existing.emailVerified,
      firstName: data.firstName ?? existing.firstName,
      lastName: data.lastName ?? existing.lastName,
      verificationToken:
        data.verificationToken !== undefined ? data.verificationToken : existing.verificationToken,
      passwordResetToken:
        data.passwordResetToken !== undefined
          ? data.passwordResetToken
          : existing.passwordResetToken,
      passwordResetTokenExpiresAt:
        data.passwordResetTokenExpiresAt !== undefined
          ? data.passwordResetTokenExpiresAt
          : existing.passwordResetTokenExpiresAt,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}

export class InMemoryRefreshTokenRepository implements IRefreshTokenRepository {
  private readonly refreshTokens = new Map<string, RefreshToken>();

  async create(data: ICreateRefreshTokenData): Promise<RefreshToken> {
    const refreshToken = new RefreshToken({
      id: randomUUID(),
      userId: data.userId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
      revokedAt: null,
      createdAt: new Date(),
    });
    this.refreshTokens.set(refreshToken.id, refreshToken);
    return refreshToken;
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    for (const refreshToken of this.refreshTokens.values()) {
      if (refreshToken.tokenHash === tokenHash) {
        return refreshToken;
      }
    }
    return null;
  }

  async revoke(id: string): Promise<void> {
    const existing = this.refreshTokens.get(id);
    if (!existing) {
      throw new Error(`Refresh token ${id} not found`);
    }
    this.refreshTokens.set(
      id,
      new RefreshToken({
        id: existing.id,
        userId: existing.userId,
        tokenHash: existing.tokenHash,
        expiresAt: existing.expiresAt,
        revokedAt: new Date(),
        createdAt: existing.createdAt,
      }),
    );
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    for (const refreshToken of this.refreshTokens.values()) {
      if (refreshToken.userId === userId && !refreshToken.isRevoked) {
        await this.revoke(refreshToken.id);
      }
    }
  }
}

export class InMemoryCategoryRepository implements ICategoryRepository {
  private readonly categories = new Map<string, Category>();

  async create(data: ICreateCategoryData): Promise<Category> {
    const now = new Date();
    const category = new Category({
      id: randomUUID(),
      userId: data.userId,
      parentId: data.parentId,
      name: data.name,
      type: data.type,
      expenseKind: data.expenseKind,
      createdAt: now,
      updatedAt: now,
    });
    this.categories.set(category.id, category);
    return category;
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.get(id) ?? null;
  }

  async findManyByUserId(
    userId: string,
    filter: IListCategoriesFilterDTO,
  ): Promise<IFilteredResult<Category>> {
    const matched = [...this.categories.values()].filter(
      (category) =>
        category.userId === userId &&
        (filter.filters?.parentId === undefined || category.parentId === filter.filters.parentId),
    );
    return listFilters(matched, filter, { searchValues: (category) => [category.name] });
  }

  async update(id: string, data: IUpdateCategoryData): Promise<Category> {
    const existing = this.categories.get(id);
    if (!existing) {
      throw new Error(`Category ${id} not found`);
    }
    const updated = new Category({
      id: existing.id,
      userId: existing.userId,
      parentId: data.parentId !== undefined ? data.parentId : existing.parentId,
      name: data.name ?? existing.name,
      type: data.type ?? existing.type,
      expenseKind: data.expenseKind !== undefined ? data.expenseKind : existing.expenseKind,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });
    this.categories.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.categories.delete(id);
  }
}

export interface IInMemoryTransactionRepositoryDeps {
  categoryRepository: InMemoryCategoryRepository;
}

export class InMemoryTransactionRepository implements ITransactionRepository {
  private readonly transactions = new Map<string, Transaction>();
  private readonly categoryRepository: InMemoryCategoryRepository;

  constructor({ categoryRepository }: IInMemoryTransactionRepositoryDeps) {
    this.categoryRepository = categoryRepository;
  }

  private async findCategorySummary(categoryId: string): Promise<Transaction["category"]> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new Error(`Category ${categoryId} not found`);
    }
    return {
      id: category.id,
      name: category.name,
      type: category.type,
      expenseKind: category.expenseKind,
    };
  }

  async create(data: ICreateTransactionData): Promise<Transaction> {
    const now = new Date();
    const transaction = new Transaction({
      id: randomUUID(),
      userId: data.userId,
      categoryId: data.categoryId,
      description: data.description,
      amount: data.amount,
      referenceMonth: data.referenceMonth,
      referenceYear: data.referenceYear,
      transactionDate: data.transactionDate,
      category: await this.findCategorySummary(data.categoryId),
      createdAt: now,
      updatedAt: now,
    });
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.get(id) ?? null;
  }

  async findManyByUserId(
    userId: string,
    filter: IListTransactionsFilterDTO,
  ): Promise<IFilteredResult<Transaction>> {
    const specific = filter.filters;
    const matched = [...this.transactions.values()].filter(
      (transaction) =>
        transaction.userId === userId &&
        (specific?.categoryId === undefined || transaction.categoryId === specific.categoryId) &&
        (specific?.referenceMonth === undefined ||
          transaction.referenceMonth === specific.referenceMonth) &&
        (specific?.referenceYear === undefined ||
          transaction.referenceYear === specific.referenceYear) &&
        (specific?.categoryType === undefined ||
          transaction.category.type === specific.categoryType) &&
        (specific?.expenseKind === undefined ||
          transaction.category.expenseKind === specific.expenseKind),
    );
    return listFilters(matched, filter, {
      searchValues: (transaction) =>
        transaction.description !== null
          ? [transaction.description, transaction.category.name]
          : [transaction.category.name],
    });
  }

  async update(id: string, data: IUpdateTransactionData): Promise<Transaction> {
    const existing = this.transactions.get(id);
    if (!existing) {
      throw new Error(`Transaction ${id} not found`);
    }
    const updated = new Transaction({
      id: existing.id,
      userId: existing.userId,
      categoryId: data.categoryId ?? existing.categoryId,
      description: data.description ?? existing.description,
      amount: data.amount ?? existing.amount,
      referenceMonth: data.referenceMonth ?? existing.referenceMonth,
      referenceYear: data.referenceYear ?? existing.referenceYear,
      transactionDate: data.transactionDate ?? existing.transactionDate,
      category:
        data.categoryId !== undefined
          ? await this.findCategorySummary(data.categoryId)
          : existing.category,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });
    this.transactions.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.transactions.delete(id);
  }
}

export class InMemoryLoanRepository implements ILoanRepository {
  private readonly loans = new Map<string, Loan>();

  async create(data: ICreateLoanData): Promise<Loan> {
    const now = new Date();
    const loan = new Loan({
      id: randomUUID(),
      userId: data.userId,
      loanDate: data.loanDate,
      personName: data.personName,
      description: data.description,
      amountLent: data.amountLent,
      amountReceived: data.amountReceived,
      openBalance: data.openBalance,
      isPaid: data.isPaid,
      createdAt: now,
      updatedAt: now,
    });
    this.loans.set(loan.id, loan);
    return loan;
  }

  async findById(id: string): Promise<Loan | null> {
    return this.loans.get(id) ?? null;
  }

  async findManyByUserId(
    userId: string,
    filter: IListLoansFilterDTO,
  ): Promise<IFilteredResult<Loan>> {
    const matched = [...this.loans.values()].filter((loan) => loan.userId === userId);
    return listFilters(matched, filter, {
      searchValues: (loan) => [loan.personName, loan.description],
    });
  }

  async update(id: string, data: IUpdateLoanData): Promise<Loan> {
    const existing = this.loans.get(id);
    if (!existing) {
      throw new Error(`Loan ${id} not found`);
    }
    const updated = new Loan({
      id: existing.id,
      userId: existing.userId,
      loanDate: data.loanDate ?? existing.loanDate,
      personName: data.personName ?? existing.personName,
      description: data.description ?? existing.description,
      amountLent: data.amountLent ?? existing.amountLent,
      amountReceived: data.amountReceived ?? existing.amountReceived,
      openBalance: data.openBalance ?? existing.openBalance,
      isPaid: data.isPaid ?? existing.isPaid,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });
    this.loans.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.loans.delete(id);
  }
}

export function createInMemoryRepositories(): IRepositories {
  const categoryRepository = new InMemoryCategoryRepository();
  return {
    userRepository: new InMemoryUserRepository(),
    refreshTokenRepository: new InMemoryRefreshTokenRepository(),
    categoryRepository,
    transactionRepository: new InMemoryTransactionRepository({ categoryRepository }),
    loanRepository: new InMemoryLoanRepository(),
  };
}
