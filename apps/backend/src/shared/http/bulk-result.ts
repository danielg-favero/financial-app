/**
 * Shared result shapes for best-effort bulk operations. Each element is processed
 * independently: successes are collected, and failures are reported per item with
 * the originating error message (the same identifier used by the single-item
 * `{ error }` contract), so the client can translate it to a user-facing message.
 */

export interface IBulkCreateFailure {
  index: number;
  error: string;
}

export interface IBulkCreateResult<TEntity> {
  created: TEntity[];
  failed: IBulkCreateFailure[];
}

export interface IBulkDeleteFailure {
  id: string;
  error: string;
}

export interface IBulkDeleteResult {
  deleted: string[];
  failed: IBulkDeleteFailure[];
}
