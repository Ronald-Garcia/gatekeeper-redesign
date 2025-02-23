import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryBudgetCodesParamsSchema, createBudgetCode, deleteBudgetCode } from "../validators/schemas";
import { like, SQL, or, desc, asc } from "drizzle-orm";
import { budgetCodes } from "../db/schema";


export const budgetCodesRoutes = new Hono();

budgetCodesRoutes.get("/budgetCodes", zValidator("param", queryBudgetCodesParamsSchema), async (c)=>{
    
})

budgetCodesRoutes.post("/budgetCodes", zValidator("json", createBudgetCode), async (c)=>{

})

budgetCodesRoutes.delete("/budgetCodes", zValidator("json", deleteBudgetCode), async (c)=>{

})