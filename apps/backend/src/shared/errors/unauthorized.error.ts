import { AppError } from "@/shared/errors/app-error";

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super({ message, statusCode: 401 });
  }
}
