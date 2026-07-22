import { BadRequestError } from "@/shared/errors/bad-request.error";

export class InvalidParentCategoryError extends BadRequestError {
  constructor() {
    super("A category cannot be its own parent");
  }
}
