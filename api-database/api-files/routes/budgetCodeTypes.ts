import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, asc, count, desc, eq, ilike, SQL } from "drizzle-orm";
import { budgetCodeType } from "../db/schema.js";
import { db } from "../db/index.js";
import { HTTPException } from "hono/http-exception";
import { 
  createBudgetCodeTypeSchema, 
  getBudgetCodeTypeSchema, 
  queryBudgetCodeTypesParamsSchema, 
  updateBudgetCodeTypeSchema 
} from "../validators/budgetCodeTypeSchema.js";
import { Context } from "../lib/context.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { authGuard } from "../middleware/authGuard.js";

/**
 * Routes for budget code type operations.
 * @get     /budget-code-types       queries all budget code types stored in the database.
 * @post    /budget-code-types       creates a new budget code type in the database.
 * @delete  /budget-code-types/:id   deletes a budget code type.
 * @patch   /budget-code-types/:id   updates a budget code type.
 */
export const budgetCodeTypeRoutes = new Hono<Context>();

/**
 * Queries all budget code types stored in the database.
 * @query page         the page to query.
 * @query limit        the amount of entries per page.
 * @query search       search through the name of the budget code types.
 * @query sort         sort by name, ascending or descending.
 * @returns page of data.
 */
budgetCodeTypeRoutes.get(
  "/budget-code-types",
  //authGuard,
  zValidator("query", queryBudgetCodeTypesParamsSchema),
  async (c) => {
    const { page = 1, limit = 20, sort, search } = c.req.valid("query");
    const whereClause: (SQL | undefined)[] = [];
  
    if (search) {
      whereClause.push(ilike(budgetCodeType.name, `%${search}%`));
    }
  
    const orderByClause: SQL[] = [];
    if (sort === "desc") {
      orderByClause.push(desc(budgetCodeType.name));
    } else if (sort === "asc") {
      orderByClause.push(asc(budgetCodeType.name));
    }
  
    const offset = (page - 1) * limit;
  
    const [allTypes, [{ totalCount }]] = await Promise.all([
      db
        .select()
        .from(budgetCodeType)
        .where(and(...whereClause))
        .orderBy(...orderByClause)
        .limit(limit)
        .offset(offset),
      // This gets the total count of budget code types from the database.
      db
        .select({ totalCount: count() })
        .from(budgetCodeType)
        .where(and(...whereClause)),
    ]);
  
    return c.json({
      success: true,
      data: allTypes,
      meta: { page, limit, total: totalCount },
      message: "Fetched all Budget Code Types",
    });
  }
);

/**
 * Create a new budget code type.
 * @body name the name of the budget code type.
 * @returns the newly created budget code type.
 */
budgetCodeTypeRoutes.post(
  "/budget-code-types",
  //authGuard,
  zValidator("json", createBudgetCodeTypeSchema),
  async (c) => {
    const { name } = c.req.valid("json");
  
    // Check if budget code type already exists.
    const [existingType] = await db
      .select()
      .from(budgetCodeType)
      .where(ilike(budgetCodeType.name, name));
  
    if (existingType) {
      throw new HTTPException(409, { message: "Budget Code Type already exists" });
    }
  
    const [newType] = await db
      .insert(budgetCodeType)
      .values({ name })
      .returning();
  
    return c.json({
      success: true,
      message: "Created a new Budget Code Type",
      data: newType,
    }, 201);
  }
);

/**
 * Delete a budget code type.
 * @param id the database ID of the budget code type.
 * @returns the deleted budget code type.
 */
budgetCodeTypeRoutes.delete(
  "/budget-code-types/:id",
  //authGuard,
  zValidator("param", getBudgetCodeTypeSchema),
  async (c) => {
    const { id } = c.req.valid("param");
  
    const [deletedType] = await db
      .delete(budgetCodeType)
      .where(eq(budgetCodeType.id, id))
      .returning();
  
    if (!deletedType) {
      throw new HTTPException(404, { message: "Budget Code Type not found" });
    }
  
    return c.json({
      success: true,
      message: "Deleted the Budget Code Type",
      data: deletedType,
    }, 200);
  }
);

/**
 * Update a budget code type.
 * @param id the database ID of the budget code type.
 * @body name the new name of the budget code type.
 * @returns the updated budget code type.
 */
budgetCodeTypeRoutes.patch(
  "/budget-code-types/:id",
  //adminGuard,
  zValidator("param", getBudgetCodeTypeSchema),
  zValidator("json", updateBudgetCodeTypeSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { name } = c.req.valid("json");
  
    // Check if a valid budget code type exists first; throw 404 if not.
    const [existingType] = await db
      .select()
      .from(budgetCodeType)
      .where(eq(budgetCodeType.id, id));
  
    if (!existingType) {
      throw new HTTPException(404, { message: "Budget Code Type not found" });
    }
  
    const [updatedType] = await db
      .update(budgetCodeType)
      .set({ name })
      .where(eq(budgetCodeType.id, id))
      .returning();
  
    return c.json({
      success: true,
      message: "Budget Code Type updated successfully",
      data: updatedType,
    });
  }
);
