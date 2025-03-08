import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryBudgetCodesParamsSchema, createBudgetCode, deleteBudgetCode } from "../validators/schemas.js";
import { like, SQL, or, desc, asc, eq, and, count } from "drizzle-orm";
import { budgetCodes } from "../db/schema.js";
import { db } from "../db/index.js";
import { HTTPException} from "hono/http-exception";



export const financialStatementRoutes = new Hono();

financialStatementRoutes.get("/fin-statements",
    zValidator("query", queryBudgetCodesParamsSchema),
    async (c) => {
    const { page = 1, limit = 20, search, sort } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(like(budgetCodes.name, `%${search}%`));
    }

        const orderByClause: SQL[] = [];
    
        switch (sort) {
            case "name_desc":
                orderByClause.push(desc(budgetCodes.name));
                break;
            case "name_asc":
                orderByClause.push(asc(budgetCodes.name));
                break;
            case "code_desc":
                orderByClause.push(desc(budgetCodes.budgetCode));
                break;
            case "code_desc":
                orderByClause.push(asc(budgetCodes.budgetCode));
                break;
        }

    const offset = (page - 1) * limit;

    const [allBudgetCodes, [{ totalCount }]] = await Promise.all([
        db
        .select({
            id: budgetCodes.id,
            name: budgetCodes.name,
            budgetCode: budgetCodes.budgetCode
        })
          .from(budgetCodes)
          .where(and(...whereClause))
          .orderBy(...orderByClause)
          .limit(limit)
          .offset(offset),

          //This gets user count from database.
        db
          .select({ totalCount: count() })
          .from(budgetCodes)
          .where(and(...whereClause)),
      ]);
    
    return c.json({
        sucess:true,
        data: allBudgetCodes,
        meta: {
            page,
            limit,
            total: totalCount,
            },
        message:"Fetched user routes"
        }
    );
    
});

financialStatementRoutes.post("/budget-codes", zValidator("json", createBudgetCode), async (c)=>{

    const { name, budgetCode } = c.req.valid("json");

    //Insertion of new Budget Code
    const [newBudgetCode] = await db
        .insert(budgetCodes)
        .values({
            name,
            budgetCode
        })
        .returning();

    return c.json({
        sucess:true,
        message:"Created new budget code",
        data:newBudgetCode
    }, 201);

})

financialStatementRoutes.delete("/budget-codes/:id", zValidator("param", deleteBudgetCode), async (c)=>{
    const { id } = c.req.valid("param");

    const budgetCode = await db.select().from(budgetCodes).where(eq(budgetCodes.id, id))

    if (!budgetCode) {
        throw new HTTPException(404, { message: "Budget Code not found!"});
    }

    const [deletedBudgetCode] = await db
        .delete(budgetCodes)
        .where(eq(budgetCodes.id, id))
        .returning();

    return c.json({
        sucess:true,
        message:"Created new budget code",
        data:deleteBudgetCode
    }, 200)

})
