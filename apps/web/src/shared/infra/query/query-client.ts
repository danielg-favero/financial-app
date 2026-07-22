import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { asBulkOutcome } from "@/shared/infra/http/bulk";
import {
  resolveBackendMessage,
  resolveErrorMessage,
  summarizeFailures,
} from "@/shared/infra/http/error-messages";

export interface IMutationMeta extends Record<string, unknown> {
  successMessage?: string;
  /** Builds the warning toast shown when a bulk operation only partially succeeds. */
  partialMessage?: (succeededCount: number, failedCount: number) => string;
  invalidates?: readonly (readonly unknown[])[];
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: IMutationMeta;
  }
}

/**
 * Every mutation reports through the MutationCache global callbacks:
 * - onError: toast with the centralized pt-BR error-code map
 * - onSuccess: toast with the feature's `meta.successMessage` and
 *   invalidation of the query keys listed in `meta.invalidates`
 */
export function createQueryClient(): QueryClient {
  const mutationCache = new MutationCache({
    onError: (error) => {
      toast.error(resolveErrorMessage(error));
    },
    onSuccess: (data, _variables, _context, mutation) => {
      const meta = mutation.meta;
      const bulk = asBulkOutcome(data);
      if (bulk && bulk.failedCount > 0) {
        if (bulk.succeededCount > 0) {
          const partial = meta?.partialMessage?.(bulk.succeededCount, bulk.failedCount);
          toast.warning(
            partial
              ? `${partial} ${summarizeFailures(bulk.failures)}`
              : summarizeFailures(bulk.failures),
          );
        } else {
          toast.error(resolveBackendMessage(bulk.failures[0]?.error ?? ""));
        }
      } else if (meta?.successMessage) {
        toast.success(meta.successMessage);
      }
      for (const queryKey of meta?.invalidates ?? []) {
        void queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  const queryClient = new QueryClient({
    mutationCache,
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  });

  return queryClient;
}
