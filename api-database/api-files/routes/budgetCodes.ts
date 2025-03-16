import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryBudgetCodesParamsSchema, createBudgetCode, deleteBudgetCodeSchema } from "../validators/schemas.js";
import { SQL, desc, asc, eq, and, count, ilike } from "drizzle-orm";
import { budgetCodes } from "../db/schema.js";
import { db } from "../db/index.js";
import { HTTPException} from "hono/http-exception";
import { Context } from "../lib/context.js";
import { adminGuard } from "../middleware/adminGuard.js";


/**
 * Routes for budget code operations.
 * @get     /budget-codes       querys all budget codes stored in database.
 * @post    /budget-codes       creates a new budget code in the database.
 * @delete  /budget-codes/:id   deletes a budget code.
 */
export const budgetCodesRoutes = new Hono<Context>();


/**
 * Queries all budget codes stored in the database.
 * @query page         the page to query.
 * @query limit        the amount of entries per page.
 * @query search       search through the name of the budget codes.
 * @query sort         sort by name or code, ascending or descending.
 * @returns page of data.
 */
budgetCodesRoutes.get("/budget-codes",
     adminGuard, 
     zValidator("query", queryBudgetCodesParamsSchema), async (c) => {
    const { page = 1, limit = 20, search, sort } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(ilike(budgetCodes.name, `%${search}%`));
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
                orderByClause.push(desc(budgetCodes.code));
                break;
            case "code_desc":
                orderByClause.push(asc(budgetCodes.code));
                break;
        }

    const offset = (page - 1) * limit;

    const [allBudgetCodes, [{ totalCount }]] = await Promise.all([
        db
            .select()
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
        success:true,
        data: allBudgetCodes,
        meta: {
            page,
            limit,
            total: totalCount,
            },
        message:"Fetched budget codes"
        }
    );
    
});

/**
 * Creates a new budget code.
 * @body name the name of the new budget code.
 * @body code the code of the budget code.
 * @returns the newly created budget code.
 */
budgetCodesRoutes.post("/budget-codes", 
    adminGuard,
    zValidator("json", createBudgetCode), async (c)=>{

    const { name, code } = c.req.valid("json");

    

    //Insertion of new Budget Code
    const [newBudgetCode] = await db
        .insert(budgetCodes)
        .values({
            name,
            code
        })
        .returning();

    return c.json({
        success:true,
        message:"Created new budget code",
        data:newBudgetCode
    }, 201);

})

/**
 * Deletes a budget code.
 * @param id the database ID of the budget code to delete.
 * @returns the budget code that was deleted.
 */
budgetCodesRoutes.delete("/budget-codes/:id", 
    adminGuard,
    zValidator("param", deleteBudgetCodeSchema), async (c)=>{
    const { id } = c.req.valid("param");

    const [deletedBudgetCode] = await db
        .delete(budgetCodes)
        .where(eq(budgetCodes.id, id))
        .returning();

    if (!deletedBudgetCode) {
        throw new HTTPException(404, { message: "Budget Code not found!"});
    }

    return c.json({
        success:true,
        message:"Deleted budget code",
        data:deletedBudgetCode
    }, 200)

})