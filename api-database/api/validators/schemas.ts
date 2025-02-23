import { z } from "zod";

export const queryUsersParamsSchema = z.object({
    sort: z.enum(["name_asc", "name_desc", "year_asc", "year_desc","jhed_asc", "jhed_desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    cardnum: z.coerce.number().int().positive().optional(),
    JHED: z.string().optional(),
});

export const createUser = z.object({
    name: z.string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    lastDigit: z.coerce
      .number()
      .int()
      .positive()
      .max(9),
    
    cardnum: z
      .string()
      .min(16, "Needs a 16 Digit J-Card Number")
      .max(16, "Needs a 16 Digit J-Card Number"),

    gradYear: z
      .coerce
      .number()
      .int()
      .max(3000)
      .min(1850)
      .optional(),

    JHED: z.string()
        .min(1, "JHED required")
        .max(8, "JHED less then 8 characters"),
    admin: z.coerce
    .number()
    .min(0,"Admin tag 0 or 1")
    .max(1,"Admin tag 0 or 1")

    
});

export const deleteUser = z.object({
    id: z.coerce.number().int().positive()

});

export const queryBudgetCodesParamsSchema = z.object({
    sort: z.enum(["name_asc", "name_desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    budgetCode: z.coerce.number().int().positive().optional(),
    name: z.string().optional(),
});

export const createBudgetCode = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  budgetCode: z.string()
    .min(8, "Needs a 8 Character Budget Code")
    .max(8, "Needs a 8 Character Budget Code"),

  
});

export const deleteBudgetCode = z.object({
  id: z.coerce.number().int().positive()

});
  