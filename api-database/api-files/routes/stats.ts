import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getStatementsOfUser, queryFinStatementParamsSchema } from "../validators/financialStatementSchemas.js";
import { SQL, desc, asc, eq, and, count, gte, lte, sum, sql, inArray } from "drizzle-orm";
import { budgetCodes, financialStatementsTable, machines, userBudgetCodeTable, userMachineType, users } from "../db/schema.js";
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
                castedDateAdded = sql<Date>`to_char("financial_statements_table"."dateAdded", 'YYYY-MM-DD HH24:MI:00')`;
                break;
            case "h":
                castedDateAdded = sql<Date>`to_char("financial_statements_table"."dateAdded", 'YYYY-MM-DD HH24:00:00')`;
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
            whereClause.push(eq(userBudgetCodeTable.userId, user.id));
        }

        whereClause.push(eq(users.id, user.id));

        
    const offset = (page - 1) * limit;    

    // const aggregateTimeSQL = db.select({
    //     dateAdded: castedDateAdded.as("agasdf"),
    //     totalTime: sum(financialStatementsTable.timeSpent).as("total_time")      
    // }).from(financialStatementsTable)
    // .groupBy(castedDateAdded).as("aggregateTimeSQL");

    let totalBudgetTime: {budgetCode: number, data: {id: number, dateAdded: Date, totalTime: string | null}[]}[] = [];
    let totalMachineTime: {machineId: number, data: {id: number, dateAdded: Date, totalTime: string | null}[]}[] = [];

    
    const userMachines = machineId ? await db.select().from(machines).where(and(inArray(machines.machineTypeId, machineId))) : undefined;
    const machinesId = userMachines ? userMachines.map(m => m.id) : undefined;
    
    for (let i = 0; budgetCode && i < budgetCode.length; i++) {

        
    
        const [[{ totalCount }], aggregateTime] = await Promise.all([
            db
            .select({ totalCount: count() })
            .from(financialStatementsTable)
            .innerJoin(users, eq(users.id, financialStatementsTable.userId))
            .innerJoin(userBudgetCodeTable, eq(userBudgetCodeTable.budgetCodeId, financialStatementsTable.budgetCode))
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
        .innerJoin(userBudgetCodeTable, eq(userBudgetCodeTable.budgetCodeId, financialStatementsTable.budgetCode))
        .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
        .where(and(...whereClause, eq(userBudgetCodeTable.budgetCodeId, budgetCode[i])))
        .groupBy(castedDateAdded, users.id, budgetCodes.name, machines.name)
        .orderBy(...orderByClause)
        .offset(offset)
            ]
        );

        totalBudgetTime = [...totalBudgetTime, { budgetCode: budgetCode[i], data: aggregateTime }];
    }
    

    for (let i = 0; machinesId && i < machinesId.length; i++) {

        
    
        const [[{ totalCount }], aggregateTime] = await Promise.all([
            db
            .select({ totalCount: count() })
            .from(financialStatementsTable)
            .innerJoin(users, eq(users.id, financialStatementsTable.userId))
            .innerJoin(userBudgetCodeTable, eq(userBudgetCodeTable.budgetCodeId, financialStatementsTable.budgetCode))
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
        .innerJoin(userBudgetCodeTable, eq(userBudgetCodeTable.budgetCodeId, financialStatementsTable.budgetCode))
        .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
        .where(and(...whereClause, eq(machines.id, machinesId[i])))
        .groupBy(castedDateAdded, users.id, budgetCodes.name, machines.name)
        .orderBy(...orderByClause)
        .offset(offset)
            ]
        );

        totalMachineTime = [...totalMachineTime, { machineId: machinesId[i], data: aggregateTime }];
    }
    

    const aggregateDateTime = [...totalMachineTime, ...totalBudgetTime];
    

    
    return c.json({
        success:true,
        data: aggregateDateTime,
        meta: {
            page,
            limit,
            },
        message:"Fetched user statistics"
        }
    );
    
});

