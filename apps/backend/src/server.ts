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

const shutdown = async (): Promise<void> => {
  await app.close();
  await db.disconnect();
  process.exit(0);
};

process.on("SIGINT", () => {
  void shutdown();
});
process.on("SIGTERM", () => {
  void shutdown();
});

try {
  await db.connect();
  await app.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  app.log.error(error);
  await db.disconnect();
  process.exit(1);
}
