import { AppError } from "@/shared/errors/app-error";

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super({ message, statusCode: 404 });
  }
}
