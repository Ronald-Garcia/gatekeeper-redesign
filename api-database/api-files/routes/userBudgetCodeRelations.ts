import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createUserBudgetSchema, deleteUserBudgetSchema, queryUserBudgetsSchema, replaceUserBudgetSchema } from "../validators/userBudgetCodeRelationSchemas";
import { getUserSchema, queryBudgetCodesParamsSchema } from "../validators/schemas";
import { and, asc, count, desc, eq, exists, ilike, SQL } from "drizzle-orm";
import { db } from "../db";
import { budgetCodes, userBudgetCodeTable, users } from "../db/schema";
import { HTTPException } from "hono/http-exception";
import { validateUserParamSchema } from "../validators/trainingSchema";
import { Context } from "../lib/context";
import { adminGuard } from "../middleware/adminGuard";


export const userBudgetCodeRelationRoute = new Hono<Context>();


userBudgetCodeRelationRoute.get("/user-budgets/:id", 
    //adminGuard,
    zValidator("query", queryUserBudgetsSchema),
    zValidator("param", validateUserParamSchema),
    async (c) => {

        const { id } = c.req.valid("param")
        const { page = 1, limit = 20, sort } = c.req.valid("query");
        const whereClause: (SQL | undefined)[] = [];
        // Check if a valid user first, throw 404 if not.
        const  [user_ent]  = await db
            .select()
            .from(users)
            .where(eq(users.id, id));

        if (!user_ent) {
            throw new HTTPException(404, { message: "User not found" });
        }
        
        const orderByClause: SQL[] = [];
           
        switch (sort) {
            case "desc":
                orderByClause.push(desc(budgetCodes.name));
                break;
            default:
                orderByClause.push(asc(budgetCodes.name));
                break;
        }
    
        const offset = (page - 1) * limit;
        
        const [allCodes, [{ totalCount }]] = await Promise.all([
            db
                .select()
                .from(userBudgetCodeTable)
                .innerJoin(budgetCodes, eq(userBudgetCodeTable.budgetCodeId, budgetCodes.id))
                .where(and(...whereClause))
                .orderBy(...orderByClause)
                .limit(limit)
                .offset(offset),
           
                     //This gets user count from database.
                   db
                     .select({ totalCount: count() })
                     .from(userBudgetCodeTable)
                     .where(and(...whereClause)),
                 ]);
               
               return c.json({
                   sucess:true,
                   data: allCodes.map(c => c.budgetCodes),
                   meta: {
                       page,
                       limit,
                       total: totalCount,
                       },
                   message:"Fetched user budget codes"
                   }); 

    }

)

userBudgetCodeRelationRoute.post("/user-budgets", 
    //adminGuard,
    zValidator("json", createUserBudgetSchema),
    async (c) => {
        const { userId, budgetCodeId } = c.req.valid("json");

        const [ ubc ] = await db.insert(userBudgetCodeTable)
            .values({
                userId,
                budgetCodeId
            }).returning()

        if (!ubc) {
            throw new HTTPException(404, { message: "User or budget not found."});
        }

        return c.json({
            success: true,
            message: "User-budget relation added successfully.",
            data: ubc
        })
    }
)

userBudgetCodeRelationRoute.delete("/user-budgets/:userId/:budgetCodeId", 
    //adminGuard,
    zValidator("param", deleteUserBudgetSchema),
    async (c) => {
        const {userId, budgetCodeId} = c.req.valid("param");

        const [ userBudgetRelation ] = await db.delete(userBudgetCodeTable).where(and(eq(userBudgetCodeTable.userId, userId), eq(userBudgetCodeTable.budgetCodeId, budgetCodeId))).returning();


        if (!userBudgetRelation) {
            throw new HTTPException(404, {message: "User budget relation not found."});
        }

        return c.json({
            success: true,
            message: "Deleted user-budget relation",
            data: userBudgetRelation
        })
    }
)

userBudgetCodeRelationRoute.patch

userBudgetCodeRelationRoute.patch("/user-budgets/:id",
        zValidator("param", getUserSchema),
        zValidator("json", replaceUserBudgetSchema),
        async (c) => {
            const { budget_code } = c.req.valid("json");
            const { id } = c.req.valid("param");

            const [user_ent] = await db.select().from(users).where(eq(users.id, id));
            if (!user_ent) {
                throw new HTTPException(404, { message: "No user found."});
            }

            await db.delete(userBudgetCodeTable).where(eq(userBudgetCodeTable.userId, id));


            const bcs = await db.insert(userBudgetCodeTable).values(budget_code.map(bc => {
                return {
                    userId: id,
                    budgetCodeId: bc
                }
            }));

            if (budget_code.length !== bcs.length) {
                throw new HTTPException(400, { message: "Unsuccessful in replacing all budget codes"});
            }

            return c.json({
                success: true,
                message: "Successfully replaced budget codes of user.",
                data: bcs
            })
        }
)