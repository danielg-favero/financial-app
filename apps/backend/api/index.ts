import type { IncomingMessage, ServerResponse } from "node:http";

import { buildApp } from "@/app";
import { env } from "@/shared/config/env";
import { DBConnection } from "@/shared/database/db-connection";
import { createPrismaRepositories } from "@/shared/database/prisma-repositories";
import { createEmailSender } from "@/shared/email/email-sender.factory";

const db = new DBConnection();
const app = buildApp({
  repositories: createPrismaRepositories(db),
  emailSender: createEmailSender(env),
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresInSeconds: env.JWT_EXPIRES_IN_SECONDS,
    refreshTokenExpiresInSeconds: env.REFRESH_TOKEN_EXPIRES_IN_SECONDS,
    appUrl: env.APP_URL,
    cookieSecure: env.COOKIE_SECURE,
  },
  logger: true,
});
const ready = app.ready();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await ready;
  app.server.emit("request", req, res);
}
