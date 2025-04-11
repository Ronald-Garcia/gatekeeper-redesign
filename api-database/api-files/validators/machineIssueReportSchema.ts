import { z } from "zod";

export const queryMachineIssuesSchema = z.object({
  sort: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  resolved: z
    .enum(["0", "1"])
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val) : undefined)),
});

export const createMachineIssueSchema = z.object({
  userId: z.coerce.number().int().positive(),
  machineId: z.coerce.number().int().positive(),
  description: z.string().min(5), // ✅ NEW
});

export const updateMachineIssueParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateMachineIssueBodySchema = z.object({
  resolved: z.enum(["0", "1"]).transform((val) => parseInt(val)),
});

export const getIssuesOfMachineSchema = z.object({
  machineId: z.coerce.number().int().positive(),
});
