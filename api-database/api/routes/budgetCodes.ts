import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryBudgetCodesParamsSchema, createBudgetCode, deleteBudgetCode } from "../validators/schemas.js";
import { like, SQL, or, desc, asc, eq } from "drizzle-orm";
import { budgetCodes } from "../db/schema.js";
import { db } from "../db/index.js";
import { HTTPException} from "hono/http-exception";



export const budgetCodesRoutes = new Hono();

budgetCodesRoutes.get("/budgetCodes", zValidator("param", queryBudgetCodesParamsSchema), async (c) => {
    const { page = 1, limit = 20, search } = c.req.valid("param");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(like(budgetCodes.name, `%${search}%`));
    }

    const results = await db
        .select()
        .from(budgetCodes)
        .where(whereClause.length ? or(...whereClause) : undefined)
        .limit(limit)
        .offset((page - 1) * limit);

    return c.json(results, 200);
});

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