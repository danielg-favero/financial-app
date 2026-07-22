import { AppError } from "@/shared/errors/app-error";

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super({ message, statusCode: 409 });
  }
}
