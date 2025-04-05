import { z } from "zod";

export const queryMachinesSchema = z.object({
    sort: z.enum(["name_asc", "name_desc", "type_asc", "type_desc"]).optional(),
    search: z.string().optional(),
    type: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    active: z.coerce.number().int().min(0).max(1).optional().default(1)
});

export const getMachineSchema = z.object({
    id: z.coerce.number().positive()
})

export const createMachineSchema = z.object({
    name: z.string(),
    machineTypeId: z.coerce.number().positive().int(),
    hourlyRate: z.coerce.number().positive().int().max(1000),
    active: z.coerce.number().int().min(0).max(1)
});

export const updateMachineSchema = createMachineSchema.partial();


export const validateMachineIdSchema = z.object({
    id: z.coerce.number().int().positive()
})