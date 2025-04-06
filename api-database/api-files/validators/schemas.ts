import { z } from "zod";
import { budgetCodeType } from "../db/schema";

export const testSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const queryUsersParamsSchema = z.object({
    sort: z.enum(["name_asc", "name_desc", "year_asc", "year_desc","jhed_asc", "jhed_desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    active: z.coerce.number().int().min(0).max(1).optional().default(1),
});

export const enableUserSchema = z.object({
  active: z.coerce.number().int().min(0).max(1),
  graduationYear: z.coerce.number().int().min(1850).max(3000).optional()
})

export const createUserSchema = z.object({
    name: z.string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),    
    cardNum: z
      .string()
      .min(16, "Needs a 16 Digit J-Card Number")
      .max(16, "Needs a 16 Digit J-Card Number"),

    graduationYear: z
      .coerce
      .number()
      .int()
      .max(3000)
      .min(1850).optional(),

    JHED: z.string()
        .min(1, "JHED required")
        .max(8, "JHED less then 8 characters"),

    isAdmin: z.coerce
    .number()
    .min(0,"Admin tag 0 or 1")
    .max(1,"Admin tag 0 or 1")

});

//This guy just checks if you have a well formed card number and a machine id.
export const getUserByCardNumSchema = z.object({
  cardNum: z
  .string()
  .min(16, "Needs a 16 Digit J-Card Number")
  .max(16, "Needs a 16 Digit J-Card Number"),
})

//Just checks if the id number is int and positive.
export const getUserSchema = z.object({
    id: z.coerce.number().int().positive()
});

export const queryBudgetCodesParamsSchema = z.object({
    sort: z.enum(["name_asc", "name_desc", "code_asc", "code_desc"]).optional(),
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
  code: z.string().min(0),
  budgetCodeTypeId: z.coerce.number().positive().int(),
  

  
});

export const deleteBudgetCodeSchema = z.object({
  id: z.coerce.number().int().positive()

});

  