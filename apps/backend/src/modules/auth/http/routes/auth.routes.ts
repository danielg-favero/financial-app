import type { FastifyPluginAsync } from "fastify";

import type { AuthController } from "@/modules/auth/http/controllers/auth.controller";
import type { AuthMiddleware } from "@/modules/auth/middlewares/auth.middleware";

export interface IBuildAuthRoutesOptions {
  controller: AuthController;
  authMiddleware: AuthMiddleware;
}

export function buildAuthRoutes({ controller, authMiddleware }: IBuildAuthRoutesOptions): FastifyPluginAsync {
  return async (app) => {
    app.post("/auth/signup", controller.signUp);
    app.post("/auth/signin", controller.signIn);
    app.post("/auth/refresh", controller.refresh);
    app.post("/auth/verify-email", controller.verifyEmail);
    app.post("/auth/forgot-password", controller.forgotPassword);
    app.post("/auth/reset-password", controller.resetPassword);

    await app.register(async (protectedScope) => {
      protectedScope.addHook("onRequest", authMiddleware.handle);
      protectedScope.post("/auth/signout", controller.signOut);
      protectedScope.get("/auth/me", controller.me);
      protectedScope.patch("/auth/me", controller.updateMe);
      protectedScope.delete("/auth/me", controller.deleteMe);
    });
  };
}
