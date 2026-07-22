import { z } from "zod";

import { CategoryType, ExpenseKind } from "@/modules/categories/domain/entities/category";
import { categoryOrderByFields } from "@/modules/categories/dtos/list-categories-filter.dto";
import { createFiltersQuerySchema, jsonQueryParamSchema } from "@/shared/http/schemas/filters.schemas";

export const createCategoryBodySchema = z.object({
  name: z.string().min(1),
  type: z.enum(CategoryType),
  expenseKind: z.enum(ExpenseKind).nullish(),
  parentId: z.uuid().nullish(),
});

export const createCategoriesBodySchema = z.array(createCategoryBodySchema).min(1);

export const updateCategoryBodySchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(CategoryType).optional(),
  expenseKind: z.enum(ExpenseKind).nullish(),
  parentId: z.uuid().nullish(),
});

export const categoryFiltersSchema = z.object({
  parentId: z.uuid().optional(),
});

export const listCategoriesQuerySchema = createFiltersQuerySchema(categoryOrderByFields).extend({
  filters: jsonQueryParamSchema(categoryFiltersSchema).optional(),
});
