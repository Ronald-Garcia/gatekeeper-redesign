import { z } from "zod";

export const validateTrainingSchema = z.object({
    userId: z
    .coerce.number().int().positive(),
    machineId: z.coerce.number().int().positive(),
});