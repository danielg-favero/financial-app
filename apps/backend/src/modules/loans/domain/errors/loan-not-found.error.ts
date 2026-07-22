import { NotFoundError } from "@/shared/errors/not-found.error";

export class LoanNotFoundError extends NotFoundError {
  constructor() {
    super("Loan not found");
  }
}
