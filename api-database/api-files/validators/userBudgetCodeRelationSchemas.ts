import { z } from "zod";


export const getUserBudgetCodesSchema = z.object({
    user_id: z.coerce.number().positive().int(),
});


export const queryUserBudgetsSchema = z.object({
    sort: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
});


export const createUserBudgetSchema = z.object({
    userId: z.coerce.number().int().positive(),
    budgetCodeId: z.coerce.number().int().positive()
})

export const deleteUserBudgetSchema = createUserBudgetSchema;

export const replaceUserBudgetSchema = z.object({
    budgetCodes: z.array(z.coerce.number().positive().int())
});