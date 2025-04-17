import { z } from "zod";

export const queryStatsParamsSchema = z.object({
    to: z.coerce.date().optional(),
    from: z.coerce.date().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    precision: z.enum(["m", "h", "d", "w", "mo", "y"]).default("m"),
    budgetCode: z.coerce.number().int().positive().optional(),
    machineId: z.coerce.number().int().positive().optional(),
});