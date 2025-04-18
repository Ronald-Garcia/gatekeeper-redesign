import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getStatementsOfUser, queryFinStatementParamsSchema } from "../validators/financialStatementSchemas.js";
import { SQL, desc, asc, eq, and, count, gte, lte, sum, sql } from "drizzle-orm";
import { budgetCodes, financialStatementsTable, machines, userBudgetCodeTable, users } from "../db/schema.js";
import { db } from "../db/index.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { authGuard } from "../middleware/authGuard.js";
import { queryStatsParamsSchema } from "../validators/statsSchema.js";
import { Context } from "../lib/context.js";

export const statsRoutes = new Hono<Context>();

// getting all financial statements
statsRoutes.get("/stats",
    authGuard,
    zValidator("query", queryStatsParamsSchema),
    async (c) => {
    
        const {page = 1, to, from, limit = 20, precision, budgetCode, machineId} = c.req.valid("query");
        const user = c.get("user")!;
        const orderByClause: SQL[] = [];
    

        let castedDateAdded: SQL<Date>;

        switch (precision) {
            case "m":
                castedDateAdded = sql<Date>`to_char("financial_statements_table"."dateAdded", 'YYYY-MM-DD-HH-MI')`;
                break;
            case "h":
                castedDateAdded = sql<Date>`to_char("financial_statements_table"."dateAdded", 'YYYY-MM-DD-HH')`;
                break;
            case "d":
                castedDateAdded = sql<Date>`cast("financial_statements_table"."dateAdded" as date)`;
                break;
            case "w":
                castedDateAdded = sql<Date>`to_char("financial_statements_table"."dateAdded", 'YYYY-MM-WW')`;
                break;
            case "mo":
                castedDateAdded = sql<Date>`to_char("financial_statements_table"."dateAdded", 'YYYY-MM')`;
                break;
            default:
                castedDateAdded = sql<Date>`to_char("financial_statements_table"."dateAdded", 'YYYY')`;
        }

        orderByClause.push(asc(castedDateAdded));

        const whereClause: SQL[] = [];

        if (from) {
            whereClause.push(gte(financialStatementsTable.dateAdded, from));
        }

        if (to) {
            whereClause.push(lte(financialStatementsTable.dateAdded, to));
        }

        if (budgetCode) {
            whereClause.push(eq(budgetCodes.id, budgetCode));
            whereClause.push(eq(userBudgetCodeTable.userId, user.id));
        }
        
        if (machineId) {
            whereClause.push(eq(machines.id, machineId));
        }

        whereClause.push(eq(users.id, user.id));

        
    const offset = (page - 1) * limit;    

    // const aggregateTimeSQL = db.select({
    //     dateAdded: castedDateAdded.as("agasdf"),
    //     totalTime: sum(financialStatementsTable.timeSpent).as("total_time")      
    // }).from(financialStatementsTable)
    // .groupBy(castedDateAdded).as("aggregateTimeSQL");

    const [[{ totalCount }], aggregateTime] = await Promise.all([
        db
          .select({ totalCount: count() })
          .from(financialStatementsTable)
          .innerJoin(users, eq(users.id, financialStatementsTable.userId))
          .innerJoin(budgetCodes, eq(budgetCodes.id, financialStatementsTable.budgetCode))
          .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
          .where(and(...whereClause))
      ,
    
      db.select({
        id: users.id,
        dateAdded: castedDateAdded,
        totalTime: sum(financialStatementsTable.timeSpent),
      }).from(financialStatementsTable)
      .innerJoin(users, eq(users.id, financialStatementsTable.userId))
      .innerJoin(budgetCodes, eq(budgetCodes.id, financialStatementsTable.budgetCode))
      .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
      .where(and(...whereClause))
      .groupBy(users.id, castedDateAdded)
      .orderBy(...orderByClause)
        ]
    );




    const aggregateDateTime = aggregateTime.map(s => { return { dateAdded: new Date(s.dateAdded), totalTime: Math.floor(Number.parseInt(s.totalTime as string) / 60)}});
    

    
    return c.json({
        success:true,
        data: aggregateDateTime,
        meta: {
            page,
            limit,
            total: totalCount,
            },
        message:"Fetched user statistics"
        }
    );
    
});

