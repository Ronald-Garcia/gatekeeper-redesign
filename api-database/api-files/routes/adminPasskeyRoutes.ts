import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryBudgetCodesParamsSchema, createBudgetCode, deleteBudgetCodeSchema, updateBudgetCodeSchema, getBudgetCodeSchema } from "../validators/schemas.js";
import { SQL, desc, asc, eq, and, count, ilike, or, inArray } from "drizzle-orm";
import { budgetCodes, budgetCodeType, userAdminPass, users } from "../db/schema.js";
import { db } from "../db/index.js";
import { HTTPException} from "hono/http-exception";
import { Context } from "../lib/context.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { createAdminPasskeyRelation, getAdminPasskeyRelation } from "../validators/adminPasskeySchema.js";


/**
 * Routes for budget code operations.
 * @get     /budget-codes       querys all budget codes stored in database.
 * @post    /budget-codes       creates a new budget code in the database.
 * @delete  /budget-codes/:id   deletes a budget code.
 */
export const adminPassKeyRoutes = new Hono<Context>();



adminPassKeyRoutes.post("/admin/passkey", zValidator("json", createAdminPasskeyRelation), async (c) => {

    const {userId, passkey} = c.req.valid("json");

    const [check] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!check || !check.isAdmin) {
        throw new HTTPException(404, { message: "User not found."});
    }

    const check_passkey = await db.delete(userAdminPass).where(eq(userAdminPass.userId, userId)).returning();

    const [newPasskey] = await db.insert(userAdminPass).values({userId, pass: passkey}).returning();

    if (!newPasskey) {
        throw new HTTPException(404, { message: "Error adding passkey"});
    }

    return c.json({
      success: true,
      data: newPasskey,
      message: "Added passkey",
    });

});

adminPassKeyRoutes.get("/admin/passkey/:userId", zValidator("param", getAdminPasskeyRelation), async (c) => {
    const {userId} = c.req.valid("param");
    const [check] = await db.select().from(users).where(eq(users.id, userId));
    if (!check || !check.isAdmin) {
        throw new HTTPException(404, { message: "User not found."});
    }

    const [check_passkey] = await db.select({ pass: userAdminPass.pass }).from(userAdminPass).where(eq(userAdminPass.userId, userId));

    const res = !check_passkey ? false : true;

    return c.json({
      success: true,
      data: res,
      message: "Validated Passkey",
    });
})


adminPassKeyRoutes.post("/admin/passkey-verify", zValidator("json", createAdminPasskeyRelation), async (c) => {

    const {userId, passkey} = c.req.valid("json");

    const [check] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!check || !check.isAdmin) {
        throw new HTTPException(404, { message: "User not found."});
    }

    const [check_passkey] = await db.select().from(userAdminPass).where(and(eq(userAdminPass.userId, userId), eq(userAdminPass.pass, passkey)));

    
    const res = !check_passkey ? false : true;

    return c.json({
      success: true,
      data: res,
      message: "Validated passkey",
    });

});