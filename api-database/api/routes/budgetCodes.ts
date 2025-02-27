import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryBudgetCodesParamsSchema, createBudgetCode, deleteBudgetCode } from "../validators/schemas";
import { like, SQL, or, desc, asc, eq } from "drizzle-orm";
import { budgetCodes } from "../db/schema";
import { db } from "../db/index";
import { HTTPException} from "hono/http-exception";



export const budgetCodesRoutes = new Hono();

budgetCodesRoutes.get("/budgetCodes", zValidator("param", queryBudgetCodesParamsSchema), async (c)=>{
    const { page = 1, limit = 20, sort, search } = c.req.valid("param");
    
    const whereClause: (SQL | undefined)[] = [];
    
    if (search) {
        whereClause.push(or(like(budgetCodes.name, search)));
    }
    
    const orderByClause: SQL[] = [];
    
    switch (sort){
        case "name_desc" :
            orderByClause.push(desc(budgetCodes.name));
            break;
        case "name_asc" :
            orderByClause.push(asc(budgetCodes.name));
            break;
            
    
    }
    return c.json( {"f":"f"} ,200);
})

budgetCodesRoutes.post("/budgetCodes", zValidator("json", createBudgetCode), async (c)=>{

    const { name, budgetCode } = c.req.valid("json");

    //Insertion of new Budget Code
    const newBudgetCode = await db
        .insert(budgetCodes)
        .values({
            name,
            budgetCode
        })
        .returning();

    return c.json(newBudgetCode, 201);

})

budgetCodesRoutes.delete("/budgetCodes", zValidator("json", deleteBudgetCode), async (c)=>{
    const { id } = c.req.valid("json");

    const budgetCode = await db.select().from(budgetCodes).where(eq(budgetCodes.id, id))

    if (!budgetCode) {
        throw new HTTPException(404, { message: "Budget Code not found!"});
    }

    const deletedBudgetCode = await db
        .delete(budgetCodes)
        .where(eq(budgetCodes.id, id))
        .returning();

    return c.json(deletedBudgetCode, 200)

})