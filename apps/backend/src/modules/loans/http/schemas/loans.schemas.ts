import { z } from "zod";

import { loanOrderByFields } from "@/modules/loans/dtos/list-loans-filter.dto";
import { createFiltersQuerySchema } from "@/shared/http/schemas/filters.schemas";

export const createLoanBodySchema = z.object({
  loanDate: z.iso.date(),
  personName: z.string().min(1),
  description: z.string().min(1),
  amountLent: z.number().positive(),
  amountReceived: z.number().min(0).optional(),
});

export const createLoansBodySchema = z.array(createLoanBodySchema).min(1);

export const updateLoanBodySchema = z.object({
  loanDate: z.iso.date().optional(),
  personName: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  amountLent: z.number().positive().optional(),
  amountReceived: z.number().min(0).optional(),
});

export const listLoansQuerySchema = createFiltersQuerySchema(loanOrderByFields);
