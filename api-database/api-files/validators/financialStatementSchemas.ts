import { z } from "zod";

export const validateTrainingSchema = z.object({
    userId: z
    .coerce.number().int().positive(),
    machineId: z
    .coerce.number().int().positive(),
});

export const createStatementSchema = z.object({
    cardNum: z
      .coerce.string().nonempty(),
    budgetCode: z
      .coerce.string().nonempty(),
    machineId: z
      .coerce.number().int().positive(),
    startTime: z
      .coerce.number().int().positive(),
    endTime: z
      .coerce.number().int().positive()
});

export const validateUserParamSchema = z.object({
    id: z
    .coerce
    .number()
    .int()
    .positive(),
});


export const queryFinStatementParamsSchema = z.object({
    sort: z.enum(["type_asc", "type_desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),

});
