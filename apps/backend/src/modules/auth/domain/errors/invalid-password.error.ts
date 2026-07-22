import { BadRequestError } from "@/shared/errors/bad-request.error";

export class InvalidPasswordError extends BadRequestError {
  constructor(message = "Password does not meet the security requirements") {
    super(message);
  }
}
