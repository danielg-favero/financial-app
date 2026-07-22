import { BadRequestError } from "@/shared/errors/bad-request.error";

export class InvalidResetTokenError extends BadRequestError {
  constructor() {
    super("Invalid or expired password reset token");
  }
}
