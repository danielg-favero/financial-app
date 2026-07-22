import type { IRepositories } from "@/app";
import { PrismaRefreshTokenRepository } from "@/modules/auth/repositories/prisma-refresh-token.repository";
import { PrismaUserRepository } from "@/modules/auth/repositories/prisma-user.repository";
import { PrismaCategoryRepository } from "@/modules/categories/repositories/prisma-category.repository";
import { PrismaLoanRepository } from "@/modules/loans/repositories/prisma-loan.repository";
import { PrismaTransactionRepository } from "@/modules/transactions/repositories/prisma-transaction.repository";
import type { DBConnection } from "@/shared/database/db-connection";

export function createPrismaRepositories(db: DBConnection): IRepositories {
  return {
    userRepository: new PrismaUserRepository({ prisma: db.client }),
    refreshTokenRepository: new PrismaRefreshTokenRepository({ prisma: db.client }),
    categoryRepository: new PrismaCategoryRepository({ prisma: db.client }),
    transactionRepository: new PrismaTransactionRepository({ prisma: db.client }),
    loanRepository: new PrismaLoanRepository({ prisma: db.client }),
  };
}
