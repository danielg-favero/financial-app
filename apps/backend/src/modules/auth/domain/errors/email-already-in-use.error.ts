import { ConflictError } from "@/shared/errors/conflict.error";

export class EmailAlreadyInUseError extends ConflictError {
  constructor() {
    super("Email already in use");
  }
}
