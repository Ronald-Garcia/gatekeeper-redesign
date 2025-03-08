import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createStatementSchema, queryFinStatementParamsSchema } from "../validators/financialStatementSchemas.js";
import { like, SQL, or, desc, asc, eq, and, count } from "drizzle-orm";
import { budgetCodes, financialStatementsTable, users } from "../db/schema.js";
import { db } from "../db/index.js";

export const financialStatementRoutes = new Hono();

// getting all financial statements
financialStatementRoutes.get("/fin-statements",
    zValidator("query", queryFinStatementParamsSchema),
    async (c) => {
    const { page = 1, limit = 20, sort } = c.req.valid("query");

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
          .orderBy(...orderByClause)
          .limit(limit)
          .offset(offset),

        db
          .select({ totalCount: count() })
          .from(budgetCodes)
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

    const { userId, budgetCode, machineId, startTime, endTime } = c.req.valid("json");

    //Insertion of new Budget Code
    const [newFinStatement] = await db
        .insert(financialStatementsTable)
        .values({
            userId,
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
