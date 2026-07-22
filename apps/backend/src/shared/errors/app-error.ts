export interface IAppError {
  readonly message: string;
  readonly statusCode: number;
}

export interface IAppErrorProps {
  message: string;
  statusCode: number;
}

export class AppError extends Error implements IAppError {
  readonly statusCode: number;

  constructor({ message, statusCode }: IAppErrorProps) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
  }
}
