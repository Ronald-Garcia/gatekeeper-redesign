import { z } from "zod";

export const createBudgetCodeTypeSchema = z.object({
    name: z.string()
});

export const updateBudgetCodeTypeSchema = createBudgetCodeTypeSchema;

export const getBudgetCodeTypeSchema = z.object({
    id: z.coerce.number().int().positive()
});

export const queryBudgetCodeTypesParamsSchema = z.object({
    sort: z.enum(["asc", "desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
}); 