import type { FastifyPluginAsync } from "fastify";

import type { TransactionsController } from "@/modules/transactions/http/controllers/transactions.controller";
import type { AuthMiddleware } from "@/modules/auth/middlewares/auth.middleware";

export interface IBuildTransactionsRoutesOptions {
  controller: TransactionsController;
  authMiddleware: AuthMiddleware;
}

export function buildTransactionsRoutes({
  controller,
  authMiddleware,
}: IBuildTransactionsRoutesOptions): FastifyPluginAsync {
  return async (app) => {
    app.addHook("onRequest", authMiddleware.handle);
    app.get("/transactions", controller.list);
    app.post("/transactions", controller.create);
    app.get("/transactions/:id", controller.get);
    app.patch("/transactions/:id", controller.update);
    app.delete("/transactions", controller.delete);
  };
}
