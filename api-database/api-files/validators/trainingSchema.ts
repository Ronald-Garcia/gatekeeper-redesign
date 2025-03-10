import { z } from "zod";

export const createTrainingSchema = z.object({
    userId: z
    .coerce.number().int().positive(),
    machineTypeId: z
    .coerce.number().int().positive(),
});

export const getTrainingSchema = createTrainingSchema;

export const getTrainingFromMachineSchema = z.object({
    userId: z.coerce.number().int().positive(),
    machineId: z.coerce.number().int().positive()
})


export const validateUserParamSchema = z.object({
    id: z
    .coerce
    .number()
    .int()
    .positive(),
});


export const queryTrainingsParamsSchema = z.object({
    sort: z.enum(["asc", "desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),

});
