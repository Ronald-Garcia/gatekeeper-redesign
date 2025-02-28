import { z } from "zod";

export const validateTypeParamSchema = z.object({
    machineType: z.string()
});


export const queryTypesParamsSchema = z.object({
    sort: z.enum(["type_asc", "type_desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),

});