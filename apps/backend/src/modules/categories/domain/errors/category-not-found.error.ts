import { NotFoundError } from "@/shared/errors/not-found.error";

export class CategoryNotFoundError extends NotFoundError {
  constructor() {
    super("Category not found");
  }
}
