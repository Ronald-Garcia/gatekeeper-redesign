import { z } from "zod";

export const createAdminPasskeyRelation = z.object({
    userId: z
    .coerce.number().int().positive(),
    passkey: z.string().max(10),
});

export const getAdminPasskeyRelation = z.object({
    userId: z.coerce.number().int().positive()
})

