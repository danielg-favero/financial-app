import { NotFoundError } from "@/shared/errors/not-found.error";

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super("User not found");
  }
}
