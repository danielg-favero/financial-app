import { BadRequestError } from "@/shared/errors/bad-request.error";

export class ParentCategoryNotFoundError extends BadRequestError {
  constructor() {
    super("Parent category not found");
  }
}
