import type { FastifyPluginAsync } from "fastify";

import type { LoansController } from "@/modules/loans/http/controllers/loans.controller";
import type { AuthMiddleware } from "@/modules/auth/middlewares/auth.middleware";

export interface IBuildLoansRoutesOptions {
  controller: LoansController;
  authMiddleware: AuthMiddleware;
}

export function buildLoansRoutes({ controller, authMiddleware }: IBuildLoansRoutesOptions): FastifyPluginAsync {
  return async (app) => {
    app.addHook("onRequest", authMiddleware.handle);
    app.get("/loans", controller.list);
    app.post("/loans", controller.create);
    app.get("/loans/:id", controller.get);
    app.patch("/loans/:id", controller.update);
    app.delete("/loans", controller.delete);
  };
}
