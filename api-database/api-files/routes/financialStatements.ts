import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createStatementSchema, queryFinStatementParamsSchema } from "../validators/financialStatementSchemas.js";
import { like, SQL, or, desc, asc, eq, and, count, between, gte, lte } from "drizzle-orm";
import { budgetCodes, financialStatementsTable, machines, users } from "../db/schema.js";
import { db } from "../db/index.js";
import { adminGuard } from "../middleware/adminGuard.js";

export const financialStatementRoutes = new Hono();

// getting all financial statements
financialStatementRoutes.get("/fin-statements",
    adminGuard,
    zValidator("query", queryFinStatementParamsSchema),
    async (c) => {
    const { page = 1, limit = 20, sort, to, from } = c.req.valid("query");

        const orderByClause: SQL[] = [];
    
        switch (sort) {
            case "type_desc":
                orderByClause.push(desc(financialStatementsTable.dateAdded));
                break;
            case "type_asc":
                orderByClause.push(asc(financialStatementsTable.dateAdded));
                break;
        }

        const whereClause: SQL[] = [];

        if (from) {
            whereClause.push(gte(financialStatementsTable.dateAdded, from));
        }

        if (to) {
            whereClause.push(lte(financialStatementsTable.dateAdded, to));
        }
        

        
    const offset = (page - 1) * limit;
    const [allFinancialStatements, [{ totalCount }]] = await Promise.all([
        db.select({
            user: {
                name: users.name,
                JHED: users.JHED,

            },
            budgetCode: {
              name: budgetCodes.name,
              code: budgetCodes.code
            },
            machine: {
              name: machines.name,
              hourlyRate: machines.hourlyRate
            },
            dateAdded: financialStatementsTable.dateAdded,
            timeSpent: financialStatementsTable.timeSpent
          }).from(financialStatementsTable)
                                          .innerJoin(users, eq(users.id, financialStatementsTable.userId))
                                          .innerJoin(budgetCodes, eq(budgetCodes.id, financialStatementsTable.budgetCode))
                                          .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
                                          .where(and(...whereClause))
                                          .limit(limit)
                                          .offset(offset)
                                          .orderBy(...orderByClause),

        db
          .select({ totalCount: count() })
          .from(financialStatementsTable)
          .innerJoin(users, eq(users.id, financialStatementsTable.userId))
        .innerJoin(budgetCodes, eq(budgetCodes.id, financialStatementsTable.budgetCode))
        .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
        .where(and(...whereClause))
        .limit(limit)
        .offset(offset)
        .groupBy(financialStatementsTable.dateAdded)
        .orderBy(...orderByClause)
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
