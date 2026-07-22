import { BadRequestError } from "@/shared/errors/bad-request.error";

export class InvalidVerificationTokenError extends BadRequestError {
  constructor() {
    super("Invalid verification token");
  }
}
