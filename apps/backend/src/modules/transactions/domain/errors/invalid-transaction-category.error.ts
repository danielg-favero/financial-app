import { BadRequestError } from "@/shared/errors/bad-request.error";

export class InvalidTransactionCategoryError extends BadRequestError {
  constructor() {
    super("Category not found");
  }
}
