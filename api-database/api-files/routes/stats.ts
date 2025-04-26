import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getStatementsOfUser, queryFinStatementParamsSchema } from "../validators/financialStatementSchemas.js";
import { SQL, desc, asc, eq, and, count, gte, lte, sum, sql, inArray } from "drizzle-orm";
import { budgetCodes, financialStatementsTable, machines, machineTypes, userBudgetCodeTable, userMachineType, users } from "../db/schema.js";
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

    let totalBudgetTime: {budgetCode: string, data: {dateAdded: Date, totalTime: string | null}[]}[] = [];
    let totalMachineTime: {machineType: string, data: {dateAdded: Date, totalTime: string | null}[]}[] = [];

    const machineTypeName = machineId ? await db.select({ name: machineTypes.name }).from(machineTypes).where(inArray(machineTypes.id, machineId)) : undefined;
    const budgetCodeNames = budgetCode ? await db.select({ name: budgetCodes.name }).from(budgetCodes).where(inArray(budgetCodes.id, budgetCode)) : undefined;
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
            dateAdded: castedDateAdded,
            totalTime: sum(financialStatementsTable.timeSpent),
        }).from(financialStatementsTable)
        .innerJoin(users, eq(users.id, financialStatementsTable.userId))
        .innerJoin(budgetCodes, eq(budgetCodes.id, financialStatementsTable.budgetCode))
        .innerJoin(userBudgetCodeTable, eq(userBudgetCodeTable.budgetCodeId, financialStatementsTable.budgetCode))
        .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
        .where(and(...whereClause, eq(userBudgetCodeTable.budgetCodeId, budgetCode[i])))
        .groupBy(castedDateAdded)
        .orderBy(...orderByClause)
        .offset(offset)
            ]
        );

        totalBudgetTime = [...totalBudgetTime, { budgetCode: budgetCodeNames![i].name, data: aggregateTime }];
    }
    

    for (let i = 0; machineId && i < machineId.length; i++) {

        
    
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
            dateAdded: castedDateAdded,
            totalTime: sum(financialStatementsTable.timeSpent),
        }).from(financialStatementsTable)
        .innerJoin(users, eq(users.id, financialStatementsTable.userId))
        .innerJoin(budgetCodes, eq(budgetCodes.id, financialStatementsTable.budgetCode))
        .innerJoin(userBudgetCodeTable, eq(userBudgetCodeTable.budgetCodeId, financialStatementsTable.budgetCode))
        .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
        .where(and(...whereClause, eq(machines.machineTypeId, machineId[i])))
        .groupBy(castedDateAdded)
        .orderBy(...orderByClause)
        .offset(offset)
            ]
        );

        totalMachineTime = [...totalMachineTime, { machineType: machineTypeName![i].name, data: aggregateTime }];
    }
    
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
        dateAdded: castedDateAdded,
        totalTime: sum(financialStatementsTable.timeSpent),
    }).from(financialStatementsTable)
    .innerJoin(users, eq(users.id, financialStatementsTable.userId))
    .innerJoin(budgetCodes, eq(budgetCodes.id, financialStatementsTable.budgetCode))
    .innerJoin(userBudgetCodeTable, eq(userBudgetCodeTable.budgetCodeId, financialStatementsTable.budgetCode))
    .innerJoin(machines, eq(machines.id, financialStatementsTable.machineId))
    .where(and(...whereClause))
    .groupBy(castedDateAdded)
    .orderBy(...orderByClause)
    .offset(offset)
        ]
    );

    const aggregateDateTime = aggregateTime.map(t => { return { dateAdded: t.dateAdded, totalTime: Math.floor(Number.parseInt(t.totalTime as string) / 60)}; })
    
    const aggregateBudgetTime = totalBudgetTime.map(s => { return { ...s, data: s.data.map(d => { return {...d, totalTime: Math.floor(Number.parseInt(d.totalTime as string) / 60)}})}})
    const aggregateMachineTime = totalMachineTime.map(s => { return {...s, data: s.data.map(d => { return {...d, totalTime: Math.floor(Number.parseInt(d.totalTime as string) / 60)}})}})

    return c.json({
        success:true,
        data: {
            total: aggregateDateTime,
            budgetCode: aggregateBudgetTime,
            machine: aggregateMachineTime
        },
        meta: {
            page,
            limit,
            },
        message:"Fetched user statistics"
        }
    );
    
});

