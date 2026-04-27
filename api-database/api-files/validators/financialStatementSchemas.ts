import { z } from "zod";

export const createStatementSchema = z.object({
    userId: z
      .coerce.number().int().positive(),
    budgetCode: z
      .coerce.number().int().positive(),
    machineId: z
      .coerce.number().int().positive(),
    timeSpent: z
      .coerce.number().int().nonnegative(),
});

export const getStatementsOfUser = z.object({
  id: z.coerce.number().int().positive()
})

export const queryFinStatementParamsSchema = z.object({
    to: z.coerce.date().optional(),
    from: z.coerce.date().optional(),
    sort: z.enum(["type_asc", "type_desc"]).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),

});

export const validateFinancialStatementIdSchema = z.object({
  id: z.coerce.number().int().positive()
})

export const validateTimeSchema = z.object({
  timeSpent: z.coerce.number().int().min(0)
})