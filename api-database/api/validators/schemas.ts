import { z } from "zod";

export const queryUsersParamsSchema = z.object({
    sort: z.enum(["name_asc", "name_desc", "year_asc", "year_desc","jhed_asc", "jhed_desc"]).optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    cardnum: z.coerce.number().int().positive().optional(),
    JHED: z.string().optional(),
});

export const createUserSchema = z.object({
    name: z.string()
      .min(1, "Name is required")
      .max(100, "Name must be 100 characters or less"),
    lastDigitOfCardNum: z.coerce
      .number()
      .int()
      .positive()
      .max(9),
    
    cardNum: z
      .string()
      .min(15, "Needs a 15 Digit J-Card Number")
      .max(15, "Needs a 15 Digit J-Card Number"),

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
export const validateUserSchema = z.object({
  cardNum: z
  .string()
  .min(15, "Needs a 15 Digit J-Card Number")
  .max(15, "Needs a 15 Digit J-Card Number"),

  lastDigitOfCardNum: z.coerce
  .number()
  .int()
  .positive()
  .max(9),

  machineId: z.coerce
  .number()
  .int()
  .positive()

})

//Just checks if the id number is int and positive.
export const getUserSchema = z.object({
    userId: z.coerce.number().int().positive()
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
  