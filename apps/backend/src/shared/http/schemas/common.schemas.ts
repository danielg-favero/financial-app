import { z } from "zod";

export const idParamsSchema = z.object({
  id: z.uuid(),
});

export const idsBodySchema = z.object({
  ids: z.array(z.uuid()).min(1),
});
