import { BadRequestError } from "@/shared/errors/bad-request.error";

export class PasswordsDontMatchError extends BadRequestError {
  constructor() {
    super("Passwords don't match");
  }
}
