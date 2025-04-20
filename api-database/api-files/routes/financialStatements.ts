import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createStatementSchema, getStatementsOfUser, queryFinStatementParamsSchema, validateFinancialStatementIdSchema, validateTimeSchema } from "../validators/financialStatementSchemas.js";
import { like, SQL, or, desc, asc, eq, and, count, between, gte, lte } from "drizzle-orm";
import { budgetCodes, financialStatementsTable, machines, users } from "../db/schema.js";
import { db } from "../db/index.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { HTTPException } from "hono/http-exception";
import { authGuard } from "../middleware/authGuard.js";

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
          .where(and(...whereClause))
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


// getting all financial statements for a user.
financialStatementRoutes.get("/fin-statements/user/:id",
    adminGuard,
    zValidator("param", getStatementsOfUser),
    zValidator("query", queryFinStatementParamsSchema),
    async (c) => {
        const { page = 1, limit = 20, sort, to, from } = c.req.valid("query");
        const { id } = c.req.valid("param");

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

        whereClause.push(eq(users.id, id));

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
          .where(and(...whereClause))
      ]);

    return c.json({
        success:true,
        data: allFinancialStatements,
        meta: {
            page,
            limit,
            total: totalCount,
            },
        message:"Fetched Financial Statements of User"
        }
    );
    
});
// adding a new financial statement
financialStatementRoutes.post("/fin-statements",
    authGuard,
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

});

//Update the time spent in a financial statement by id.
financialStatementRoutes.patch("/fin-statements/:id",
    authGuard,
    zValidator("param", validateFinancialStatementIdSchema),
    zValidator("json", validateTimeSchema),
    async (c)=>{

    const { id } = c.req.valid("param");
    const { timeSpent } = c.req.valid("json");

    //For financial statement, make sure a financial statement with matching user, machine, and budget code exists
    const [finStatement] = await db
        .select()
        .from(financialStatementsTable)
        .where(eq(financialStatementsTable.id, id));
    
        if (!finStatement) {
            throw new HTTPException(404, { message: "No financial statement found" });
        }
    
    //If we have the financial statement, update it and return the updated entry.
    const [updatedStatement] = await db
        .update(financialStatementsTable)
        .set({timeSpent})
        .where(eq(financialStatementsTable.id, id))
        .returning();

    return c.json({
        success:true,
        message:"Updated time for financial statement",
        data:updatedStatement
    }, 201);

})

