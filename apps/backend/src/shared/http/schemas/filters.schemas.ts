import { z } from "zod";

export const sortDirectionSchema = z.enum(["asc", "desc"]);

export const createFiltersQuerySchema = <TOrderBy extends readonly [string, ...string[]]>(
  orderByFields: TOrderBy,
) =>
  z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).default(20),
    search: z.string().min(1).optional(),
    orderBy: z.enum(orderByFields).optional(),
    sort: sortDirectionSchema.default("asc"),
  });

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/** Validates a JSON-encoded query parameter (e.g. `?filters={"categoryId":"..."}`). */
export const jsonQueryParamSchema = <TSchema extends z.ZodType>(schema: TSchema) =>
  z.string().transform((value, ctx): z.output<TSchema> => {
    const json = ((): { success: true; value: JsonValue } | { success: false } => {
      try {
        return { success: true, value: JSON.parse(value) as JsonValue };
      } catch {
        return { success: false };
      }
    })();

    if (!json.success) {
      ctx.addIssue({ code: "custom", message: "Invalid JSON in query parameter" });
      return z.NEVER;
    }

    const result = schema.safeParse(json.value);
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ code: "custom", message: issue.message, path: issue.path });
      }
      return z.NEVER;
    }

    return result.data as z.output<TSchema>;
  });
