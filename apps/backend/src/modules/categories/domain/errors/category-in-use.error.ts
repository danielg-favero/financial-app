import { ConflictError } from "@/shared/errors/conflict.error";

export class CategoryInUseError extends ConflictError {
  constructor() {
    super("Category is in use and cannot be deleted");
  }
}
