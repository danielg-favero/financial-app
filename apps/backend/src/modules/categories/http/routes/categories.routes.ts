import type { FastifyPluginAsync } from "fastify";

import type { CategoriesController } from "@/modules/categories/http/controllers/categories.controller";
import type { AuthMiddleware } from "@/modules/auth/middlewares/auth.middleware";

export interface IBuildCategoriesRoutesOptions {
  controller: CategoriesController;
  authMiddleware: AuthMiddleware;
}

export function buildCategoriesRoutes({
  controller,
  authMiddleware,
}: IBuildCategoriesRoutesOptions): FastifyPluginAsync {
  return async (app) => {
    app.addHook("onRequest", authMiddleware.handle);
    app.get("/categories", controller.list);
    app.post("/categories", controller.create);
    app.get("/categories/:id", controller.get);
    app.patch("/categories/:id", controller.update);
    app.delete("/categories", controller.delete);
  };
}
