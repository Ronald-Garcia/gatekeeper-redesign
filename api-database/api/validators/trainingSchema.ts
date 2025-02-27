import { z } from "zod";

export const validateTrainingSchema = z.object({
    userId: z
    .coerce.number().int().positive(),
    machineType: z.string(),
});