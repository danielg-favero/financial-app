import { z } from "zod";

import { CategoryType, ExpenseKind } from "@/modules/categories/domain/entities/category";
import { transactionOrderByFields } from "@/modules/transactions/dtos/list-transactions-filter.dto";
import { createFiltersQuerySchema, jsonQueryParamSchema } from "@/shared/http/schemas/filters.schemas";

export const createTransactionBodySchema = z.object({
  categoryId: z.uuid(),
  description: z.string().trim().min(1).nullable().optional(),
  amount: z.number().finite(),
  referenceMonth: z.number().int().min(1).max(12),
  referenceYear: z.number().int().min(1900).max(2200),
  transactionDate: z.iso.date(),
});

export const createTransactionsBodySchema = z.array(createTransactionBodySchema).min(1);

export const updateTransactionBodySchema = z.object({
  categoryId: z.uuid().optional(),
  description: z.string().trim().min(1).nullable().optional(),
  amount: z.number().finite().optional(),
  referenceMonth: z.number().int().min(1).max(12).optional(),
  referenceYear: z.number().int().min(1900).max(2200).optional(),
  transactionDate: z.iso.date().optional(),
});

export const transactionFiltersSchema = z.object({
  categoryId: z.uuid().optional(),
  referenceMonth: z.number().int().min(1).max(12).optional(),
  referenceYear: z.number().int().min(1900).max(2200).optional(),
  categoryType: z.enum(CategoryType).optional(),
  expenseKind: z.enum(ExpenseKind).optional(),
});

export const listTransactionsQuerySchema = createFiltersQuerySchema(
  transactionOrderByFields,
).extend({
  filters: jsonQueryParamSchema(transactionFiltersSchema).optional(),
});
