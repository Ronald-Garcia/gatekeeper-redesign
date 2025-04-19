import { z } from "zod";

export const queryStatsParamsSchema = z.object({
    to: z.coerce.date().optional(),
    from: z.coerce.date().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    precision: z.enum(["m", "h", "d", "w", "mo", "y"]).default("mo"),
    budgetCode: z.union([
        z.array(z.coerce.number().int().min(0)),
        z.coerce.number().int().min(0),
      ]).optional()
      // wrap single number into an array 
      .transform((val) => {
        if (val === undefined) return undefined;
        return Array.isArray(val) ? val : [val];
      }),
    machineId: z.union([
        z.array(z.coerce.number().int().min(0)),
        z.coerce.number().int().min(0),
      ])
      .optional()
      // wrap single number into an array 
      .transform((val) => {
        if (val === undefined) return undefined;
        return Array.isArray(val) ? val : [val];
      })
});