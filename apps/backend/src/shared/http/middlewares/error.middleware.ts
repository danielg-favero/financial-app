import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import { AppError } from "@/shared/errors/app-error";

export class ErrorMiddleware {
  readonly handle = (error: FastifyError, request: FastifyRequest, reply: FastifyReply): void => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ error: error.message });
      return;
    }

    if (error instanceof ZodError) {
      const issue = error.issues.at(0);
      const message = issue
        ? issue.path.length > 0
          ? `${issue.path.join(".")}: ${issue.message}`
          : issue.message
        : "Validation error";
      reply.status(400).send({ error: message });
      return;
    }

    if (typeof error.statusCode === "number" && error.statusCode >= 400 && error.statusCode < 500) {
      reply.status(error.statusCode).send({ error: error.message });
      return;
    }

    request.log.error(error);
    reply.status(500).send({ error: "Internal server error" });
  };
}
