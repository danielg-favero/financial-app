import { AppError } from "@/shared/errors/app-error";

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super({ message, statusCode: 403 });
  }
}
