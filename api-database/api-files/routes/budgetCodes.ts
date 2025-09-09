import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryBudgetCodesParamsSchema, createBudgetCode, deleteBudgetCodeSchema, updateBudgetCodeSchema, getBudgetCodeSchema } from "../validators/schemas.js";
import { SQL, desc, asc, eq, and, count, ilike } from "drizzle-orm";
import { budgetCodes, budgetCodeType } from "../db/schema.js";
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
    const { page = 1, limit = 20, search, sort, active, budgetTypeId } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(ilike(budgetCodes.name, `%${search}%`));
    }

    if (active !== undefined) {
        whereClause.push(eq(budgetCodes.active, active));
    }

    if (budgetTypeId !== undefined) {
        whereClause.push(eq(budgetCodes.budgetCodeTypeId, budgetTypeId));
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
            .select({
                id: budgetCodes.id,
                name: budgetCodes.name,
                code: budgetCodes.code,
                active: budgetCodes.active,
                type: {
                  id: budgetCodeType.id,
                  name: budgetCodeType.name,
                },
              })
            .from(budgetCodes) 
            .innerJoin(
                budgetCodeType,
                eq(budgetCodes.budgetCodeTypeId, budgetCodeType.id)
              )
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

    const { name, code, budgetCodeTypeId } = c.req.valid("json");

     const [budgetCodeCheck1] = await db
            .select()
            .from(budgetCodeType)
            .where(eq(budgetCodeType.id, budgetCodeTypeId))
        
        if (!budgetCodeCheck1) {
            throw new HTTPException(404, { message: "Invalid machine type" });
        }

    //Check if there is a duplicate.
    const [budgetCodeCheck] = await db
    .select()
    .from(budgetCodes)
    .where(eq(budgetCodes.code, code))
    if (budgetCodeCheck) {
        throw new HTTPException(409, {message:"Budget code already exists"})
    }

    //Insertion of new Budget Code
    const [newBudgetCode] = await db
        .insert(budgetCodes)
        .values({
            name,
            code,
            budgetCodeTypeId
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

    const [budgetCodeCheck] = await db
    .select()
    .from(budgetCodes)
    .where(eq(budgetCodes.id, id))
    if (!budgetCodeCheck) {
        throw new HTTPException(404, { message: "Budget Code not found!"});
    }

    const [deletedBudgetCode] = await db
        .update(budgetCodes)
        .set({active: 0})
        .where(eq(budgetCodes.id, id))
        .returning();

    return c.json({
        success:true,
        message:"Deleted budget code",
        data:deletedBudgetCode
    }, 200)

})

budgetCodesRoutes.patch("/budget-codes/:id",
    adminGuard,
    zValidator("param", getBudgetCodeSchema),
    zValidator("json", updateBudgetCodeSchema), async (c)=>{
    const { id } = c.req.valid("param");

    const { active, code } = c.req.valid("json");

    const [budgetCodeCheck] = await db
        .select()
        .from(budgetCodes)
        .where(eq(budgetCodes.id, id))
    if (!budgetCodeCheck) {
        throw new HTTPException(404, { message: "Budget Code not found!"});
    }



    if (code) {
        const [budgetCodeCheck] = await db
            .select({ code: budgetCodes.code})
            .from(budgetCodes)
            .where(eq(budgetCodes.code, code));
        if (budgetCodeCheck) {
            throw new HTTPException(409, {message:"Budget code already exists"})
        }

        

    }



    const [bc] = await db
    .update(budgetCodes)
    .set({active, code})
    .where(eq(budgetCodes.id, id))
    .returning();

    return c.json({
        success:true,
        message:"Updated budget code",
        data:bc
    }, 200);
    
})
