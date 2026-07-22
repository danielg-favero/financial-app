import { NotFoundError } from "@/shared/errors/not-found.error";

export class TransactionNotFoundError extends NotFoundError {
  constructor() {
    super("Transaction not found");
  }
}
