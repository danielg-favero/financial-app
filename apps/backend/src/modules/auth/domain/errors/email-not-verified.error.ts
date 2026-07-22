import { ForbiddenError } from "@/shared/errors/forbidden.error";

export class EmailNotVerifiedError extends ForbiddenError {
  constructor() {
    super("Email not verified");
  }
}
