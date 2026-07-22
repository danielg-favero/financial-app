import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import { fastify, type FastifyInstance } from "fastify";

import { AuthContainer, type IAuthConfig } from "@/modules/auth/container";
import type { IRefreshTokenRepository } from "@/modules/auth/repositories/refresh-token.repository";
import type { IUserRepository } from "@/modules/auth/repositories/user.repository";
import { CategoriesContainer } from "@/modules/categories/container";
import type { ICategoryRepository } from "@/modules/categories/repositories/category.repository";
import { LoansContainer } from "@/modules/loans/container";
import type { ILoanRepository } from "@/modules/loans/repositories/loan.repository";
import { TransactionsContainer } from "@/modules/transactions/container";
import type { ITransactionRepository } from "@/modules/transactions/repositories/transaction.repository";
import type { IEmailSender } from "@/shared/email/email-sender.provider";
import { ErrorMiddleware } from "@/shared/http/middlewares/error.middleware";

export interface IRepositories {
  userRepository: IUserRepository;
  refreshTokenRepository: IRefreshTokenRepository;
  categoryRepository: ICategoryRepository;
  transactionRepository: ITransactionRepository;
  loanRepository: ILoanRepository;
}

export interface IBuildAppOptions {
  repositories: IRepositories;
  emailSender: IEmailSender;
  auth: IAuthConfig;
  logger?: boolean;
}

export function buildApp({
  repositories,
  emailSender,
  auth,
  logger,
}: IBuildAppOptions): FastifyInstance {
  const authContainer = new AuthContainer({
    userRepository: repositories.userRepository,
    refreshTokenRepository: repositories.refreshTokenRepository,
    emailSender,
    config: auth,
  });
  const categoriesContainer: CategoriesContainer = new CategoriesContainer({
    categoryRepository: repositories.categoryRepository,
    authMiddleware: authContainer.authMiddleware,
    listTransactionsService: () =>
      transactionsContainer.listTransactionsService,
  });
  const transactionsContainer: TransactionsContainer =
    new TransactionsContainer({
      transactionRepository: repositories.transactionRepository,
      authMiddleware: authContainer.authMiddleware,
      getCategoryService: categoriesContainer.getCategoryService,
    });
  const loansContainer = new LoansContainer({
    loanRepository: repositories.loanRepository,
    authMiddleware: authContainer.authMiddleware,
  });

  const app = fastify({ logger: logger ?? false });

  app.register(fastifyCookie);
  app.register(fastifyCors, {
    origin: new URL(auth.appUrl).origin,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
  });
  app.register(fastifyRateLimit, {
    global: true,
    max: 100,
    timeWindow: "1 minute",
  });

  app.decorateRequest("userId", "");
  app.decorateRequest("tokenJti", "");
  app.decorateRequest("tokenExpiresAt", 0);

  const errorMiddleware = new ErrorMiddleware();
  app.setErrorHandler(errorMiddleware.handle);
  app.setNotFoundHandler((request, reply) => {
    reply
      .status(404)
      .send({ error: `Route ${request.method} ${request.url} not found` });
  });

  app.register(authContainer.routes, { prefix: "/api" });
  app.register(categoriesContainer.routes, { prefix: "/api" });
  app.register(transactionsContainer.routes, { prefix: "/api" });
  app.register(loansContainer.routes, { prefix: "/api" });

  return app;
}
