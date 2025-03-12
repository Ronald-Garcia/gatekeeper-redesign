import { z } from "zod";

export const createMachineTypeSchema = z.object({
    name: z.string()
});

export const updateMachineTypeSchema = createMachineTypeSchema;

export const getMachineTypeSchema = z.object({
    id: z.coerce.number().int().positive()
})


export const queryTypesParamsSchema = z.object({
    sort: z.enum(["asc", "desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),

});