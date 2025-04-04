import { z } from "zod";

export const queryMachineIssuesSchema = z.object({
    sort: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    resolved: z
        .enum(["0", "1"])
        .optional()
        .transform(val => (val !== undefined ? parseInt(val) : undefined)), // Handle undefined case
});
export const createMachineIssueSchema = z.object({
    userId: z.coerce.number().int().positive(),
    machineId: z.coerce.number().int().positive()
});

export const updateMachineIssueSchema = z.object({
    id: z.coerce.number().int().positive(),
    resolved: z.enum(["0", "1"]).transform(val => parseInt(val)), // Convert to integer
});
