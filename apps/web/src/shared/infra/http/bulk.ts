/**
 * Response shapes for the backend's best-effort bulk endpoints. Each element is
 * processed independently: successes are collected and failures are reported per
 * item with the originating backend error message (translated for display through
 * the centralized error-code map).
 */

export interface IBulkCreateFailure {
  index: number;
  error: string;
}

export interface IBulkCreateResponse<TEntity> {
  created: TEntity[];
  failed: IBulkCreateFailure[];
}

export interface IBulkDeleteFailure {
  id: string;
  error: string;
}

export interface IBulkDeleteResponse {
  deleted: string[];
  failed: IBulkDeleteFailure[];
}

interface IBulkOutcome {
  succeededCount: number;
  failedCount: number;
  failures: readonly { error: string }[];
}

/**
 * Narrows an unknown mutation result to a bulk outcome (create or delete), or
 * returns null when the payload is not a bulk response. Lets the global mutation
 * handler react to partial failures without each feature wiring its own toasts.
 */
export function asBulkOutcome(data: unknown): IBulkOutcome | null {
  if (typeof data !== "object" || data === null || !("failed" in data)) {
    return null;
  }
  const failed = (data as { failed: unknown }).failed;
  if (!Array.isArray(failed)) {
    return null;
  }
  const succeeded =
    "created" in data
      ? (data as { created: unknown }).created
      : "deleted" in data
        ? (data as { deleted: unknown }).deleted
        : undefined;
  if (!Array.isArray(succeeded)) {
    return null;
  }
  return {
    succeededCount: succeeded.length,
    failedCount: failed.length,
    failures: failed as readonly { error: string }[],
  };
}
