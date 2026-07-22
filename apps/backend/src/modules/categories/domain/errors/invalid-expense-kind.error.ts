import { BadRequestError } from "@/shared/errors/bad-request.error";

export class InvalidExpenseKindError extends BadRequestError {
  constructor() {
    super("expenseKind is only allowed for DESPESA categories");
  }
}
