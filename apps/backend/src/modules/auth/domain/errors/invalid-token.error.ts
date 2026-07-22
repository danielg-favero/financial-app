import { UnauthorizedError } from "@/shared/errors/unauthorized.error";

export class InvalidTokenError extends UnauthorizedError {
  constructor() {
    super("Invalid or expired token");
  }
}
