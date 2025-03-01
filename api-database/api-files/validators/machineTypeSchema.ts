import { z } from "zod";

export const validateTypeSchema = z.object({
    machineType: z.string()
});

export const validateTypeParamSchema = z.object({
    machineType: z.string()
});

export const getMachineTypeSchema = z.object({
    machineTypeId: z.coerce.number().int().positive()
})


export const queryTypesParamsSchema = z.object({
    sort: z.enum(["type_asc", "type_desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),

});

export const updateTypeSchema = z.object({
    updateType: z.string()
});