import { z } from "zod";

export const createStatementSchema = z.object({
    userId: z
      .coerce.number().int().positive(),
    budgetCode: z
      .coerce.number().int().positive(),
    machineId: z
      .coerce.number().int().positive(),
    dateAdded: z
      .coerce.date(),
    timeSpent: z
      .coerce.number().int().positive()
});

export const queryFinStatementParamsSchema = z.object({
    sort: z.enum(["type_asc", "type_desc"]).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),

});
