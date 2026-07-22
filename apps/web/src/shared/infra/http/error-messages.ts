import axios from "axios";

export const GENERIC_ERROR_MESSAGE = "Algo deu errado. Tente novamente.";

export const EMAIL_NOT_VERIFIED_ERROR = "Email not verified";

/**
 * Maps the backend's error identifiers (the `error` field of error responses)
 * to pt-BR user-facing messages.
 */
const ERROR_MESSAGES: Record<string, string> = {
  "Email already in use": "Este e-mail já está em uso.",
  [EMAIL_NOT_VERIFIED_ERROR]: "Confirme seu e-mail antes de entrar.",
  "Invalid email or password": "E-mail ou senha inválidos.",
  "Invalid or expired token": "Sua sessão expirou. Entre novamente.",
  "Invalid verification token": "Código de verificação inválido.",
  "Invalid or expired password reset token":
    "O link de redefinição de senha é inválido ou expirou. Solicite um novo.",
  "Passwords don't match": "As senhas não coincidem.",
  "Missing authentication token": "Sua sessão expirou. Entre novamente.",
  "User not found": "Usuário não encontrado.",
  "Category not found": "Categoria não encontrada.",
  "Category is in use and cannot be deleted":
    "A categoria está em uso e não pode ser excluída.",
  "Parent category not found": "Categoria superior não encontrada.",
  "A category cannot be its own parent":
    "Uma categoria não pode ser a própria categoria superior.",
  "expenseKind is only allowed for DESPESA categories":
    "A classificação fixa/variável só é permitida para categorias de despesa.",
  "Transaction not found": "Transação não encontrada.",
  "Loan not found": "Empréstimo não encontrado.",
};

interface IApiErrorBody {
  error?: string;
}

export function getApiErrorCode(error: unknown): string | undefined {
  if (axios.isAxiosError<IApiErrorBody>(error)) {
    return error.response?.data?.error;
  }
  return undefined;
}

export function resolveErrorMessage(error: unknown): string {
  const backendError = getApiErrorCode(error);
  if (backendError && ERROR_MESSAGES[backendError]) {
    return ERROR_MESSAGES[backendError];
  }
  return GENERIC_ERROR_MESSAGE;
}

/**
 * Translates a raw backend error identifier (as carried by each per-item failure
 * of a bulk response) to its pt-BR user-facing message.
 */
export function resolveBackendMessage(code: string): string {
  return ERROR_MESSAGES[code] ?? GENERIC_ERROR_MESSAGE;
}

/** Joins the distinct translated reasons behind a set of bulk per-item failures. */
export function summarizeFailures(failures: readonly { error: string }[]): string {
  const reasons = new Set(failures.map((failure) => resolveBackendMessage(failure.error)));
  return Array.from(reasons).join(" ");
}
