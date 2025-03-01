import { z } from "zod";

export const queryMachinesByNameSchema = z.object({
    sort: z.enum(["name_asc", "name_desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
});

export const getMachineSchema = z.object({
    id: z.coerce.number().positive()
})

export const queryMachinesByTypeSchema = z.object({
    sort: z.enum(["type_asc", "type_desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
});

export const createMachineSchema = z.object({
    name: z.string(),
    machineTypeId: z.coerce.number().positive().int(),
    hourlyRate: z.coerce.number().positive().int().max(1000)
});

export const updateMachineSchema = createMachineSchema.partial();


export const validateMachineIdSchema = z.object({
    id: z.coerce.number().int().positive()
})