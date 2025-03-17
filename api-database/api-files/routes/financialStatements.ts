import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createStatementSchema, queryFinStatementParamsSchema } from "../validators/financialStatementSchemas.js";
import { like, SQL, or, desc, asc, eq, and, count } from "drizzle-orm";
import { financialStatementsTable, users } from "../db/schema.js";
import { db } from "../db/index.js";
import { adminGuard } from "../middleware/adminGuard.js";

export const financialStatementRoutes = new Hono();

// getting all financial statements
financialStatementRoutes.get("/fin-statements",
    adminGuard,
    zValidator("query", queryFinStatementParamsSchema),
    async (c) => {
    const { page = 1, limit = 20, sort } = c.req.valid("query");

        const orderByClause: SQL[] = [];
    
        switch (sort) {
            case "type_desc":
                orderByClause.push(desc(financialStatementsTable.userId));
                break;
            case "type_asc":
                orderByClause.push(asc(financialStatementsTable.userId));
                break;
        }

    const offset = (page - 1) * limit;

    const [allFinancialStatements, [{ totalCount }]] = await Promise.all([
        db
        .select()
          .from(financialStatementsTable)
          .orderBy(...orderByClause)
          .limit(limit)
          .offset(offset),

        db
          .select({ totalCount: count() })
          .from(financialStatementsTable)
      ]);
    
    return c.json({
        success:true,
        data: allFinancialStatements,
        meta: {
            page,
            limit,
            total: totalCount,
            },
        message:"Fetched Financial Statements"
        }
    );
    
});

// adding a new financial statement
financialStatementRoutes.post("/fin-statements",
    adminGuard,
    zValidator("json", createStatementSchema),
    async (c)=>{

    const { userId, budgetCode, machineId, timeSpent } = c.req.valid("json");

    //Insertion of new Budget Code
    const [newFinStatement] = await db
        .insert(financialStatementsTable)
        .values({
            userId,
            budgetCode,
            machineId,
            timeSpent,
            dateAdded: new Date()
        })
        .returning();

    return c.json({
        success:true,
        message:"Created new financial statement code",
        data:newFinStatement
    }, 201);

})
