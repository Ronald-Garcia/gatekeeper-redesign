import { z } from "zod";

export const validateTrainingSchema = z.object({
    userId: z
    .coerce.number().int().positive(),
    machineType: z.string(),
});

export const validateUserParamSchema = z.object({
    id: z
    .coerce
    .number()
    .int()
    .positive(),
});


export const queryTrainingsParamsSchema = z.object({
    sort: z.enum(["type_asc", "type_desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),

});
