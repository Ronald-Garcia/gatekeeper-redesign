import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createStatementSchema, queryFinStatementParamsSchema } from "../validators/financialStatementSchemas.js";
import { like, SQL, or, desc, asc, eq, and, count } from "drizzle-orm";
import { budgetCodes, financialStatementsTable, users } from "../db/schema.js";
import { db } from "../db/index.js";
import { HTTPException} from "hono/http-exception";



export const financialStatementRoutes = new Hono();

// not done
financialStatementRoutes.get("/fin-statements",
    zValidator("query", queryFinStatementParamsSchema),
    async (c) => {
    const { page = 1, limit = 20, search, sort } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(like(budgetCodes.name, `%${search}%`));
    }

        const orderByClause: SQL[] = [];
    
        switch (sort) {
            case "type_desc":
                orderByClause.push(desc(budgetCodes.name));
                break;
            case "type_asc":
                orderByClause.push(asc(budgetCodes.name));
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

// adding a new financial statement
financialStatementRoutes.post("/fin-statements",
    zValidator("json", createStatementSchema),
    async (c)=>{

    const { cardNum, budgetCode, machineId, startTime, endTime } = c.req.valid("json");

    const  [user_ent]  = await db
    .select()
    .from(users)
    .where(eq(users.cardNum, cardNum));

    //Insertion of new Budget Code
    const [newFinStatement] = await db
        .insert(financialStatementsTable)
        .values({
            cardNum,
            budgetCode,
            machineId,
            startTime,
            endTime
        })
        .returning();

    return c.json({
        sucess:true,
        message:"Created new financial statement code",
        data:newFinStatement
    }, 201);

})
