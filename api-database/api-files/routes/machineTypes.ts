import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, asc, count, desc, eq, ilike, like, or, SQL } from "drizzle-orm";
import { machineTypes } from "../db/schema.js";
import { db } from "../db/index.js";
import { HTTPException } from "hono/http-exception"
import { createMachineTypeSchema, getMachineTypeSchema, queryTypesParamsSchema, updateMachineTypeSchema } from "../validators/machineTypeSchema.js";
import { Context } from "../lib/context.js";

/**
 * Routes for machine type operations.
 * @get     /machine-types       querys all machine types stored in database.
 * @post    /machine-types       creates a new machine type in the database.
 * @delete  /machine-types/:id   deletes a machine type.
 * @patch   /machine-types/:id   updates a machine type.
 */
export const machineTypeRoutes = new Hono<Context>();

/**
 * Queries all machine types stored in the database.
 * @query page         the page to query.
 * @query limit        the amount of entries per page.
 * @query search       search through the name of the machine types.
 * @query sort         sort by type, ascending or descending.
 * @returns page of data.
 */
machineTypeRoutes.get(
    "/machine-types", 
    //authGuard,
    zValidator("query", queryTypesParamsSchema),
    async (c) => {
    const { page = 1, limit = 20, sort, search } = c.req.valid("query");
        const whereClause: (SQL | undefined)[] = [];

        // Get into searching
        if (search) {
            whereClause.push(
                ilike(machineTypes.name, `%${search}%`)
            );
        }
    
        const orderByClause: SQL[] = [];
    
        switch (sort) {
            case "desc":
                orderByClause.push(desc(machineTypes.name));
                break;
            case "asc":
                orderByClause.push(asc(machineTypes.name));
                break;
        }
    
        const offset = (page - 1) * limit;
    
        const [allTypes, [{ totalCount }]] = await Promise.all([
            db
            .select()
            .from(machineTypes)
            .where(and(...whereClause))
            .orderBy(...orderByClause)
            .limit(limit)
            .offset(offset),
    
              //This gets type count from database.
            db
              .select({ totalCount: count() })
              .from(machineTypes)
              .where(and(...whereClause)),
          ]);
        
        return c.json({
            success:true,
            data: allTypes,
            meta: {
                page,
                limit,
                total: totalCount,
                },
            message:"Fetched all Types"
            }
        );
    });


/**
 * Create a new machine type.
 * @body name the name of the machine type.
 * @returns the newly created machine type.
 */
machineTypeRoutes.post("/machine-types", 
    //authGuard,
    zValidator("json", createMachineTypeSchema),
     async (c)=>{

    const { name } = c.req.valid("json");

    // Check if machine type already exists
    const  [mtype]  = await db
    .select()
    .from(machineTypes)
    .where(ilike(machineTypes.name, name));

    if (mtype) {
        throw new HTTPException(409, { message: "Machine Type already exists" });
    }

    const [newMachineType] = await db
        .insert(machineTypes)
        .values({
            name
        })
        .returning();

    return c.json({
        success:true,
        message:"Created a new machine type",
        data: newMachineType
    }, 201);
})


/**
 * Delete a machine type.
 * @param id the database ID of the machine type.
 * @returns the deleted machine type.
 */
machineTypeRoutes.delete("/machine-types/:id", 
    //authGuard,
    zValidator("param", getMachineTypeSchema),
    async (c)=>{

        const { id } = c.req.valid("param");

        // Check if a valid type first, throw 404 if not.
        const  [type]  = await db
        .delete(machineTypes)
        .where(eq(machineTypes.id, id))
        .returning();

        if (!type) {
            throw new HTTPException(404, { message: "Machine Type not found" });
        }

        return c.json({
            success:true,
            message:"Deleted a machine type",
            data: type
        }, 200);
})

/**
 * Update a machine type.
 * @param id    the database ID of the machine type.
 * @body name   the new name of the machine type.
 * @returns the updated machine type.
 */
machineTypeRoutes.patch("/machine-types/:id", 
    //adminGuard,
    zValidator("param", getMachineTypeSchema),
    zValidator("json", updateMachineTypeSchema),
     async (c)=>{

    const { id } = c.req.valid("param");
    const { name } = c.req.valid("json");

    // Check if a valid type first, throw 404 if not.
    const  [type]  = await db
    .select()
    .from(machineTypes)
    .where(eq(machineTypes.id, id));

    if (!type) {
        throw new HTTPException(404, { message: "Machine Type not found" });
    }

    const [updatedMachineType] = await db
    .update(machineTypes)
    .set({ name })
    .where(eq(machineTypes.id, id))
    .returning();

    return c.json({
        success: true,
        message: "Machine type updated successfully",
        data: updatedMachineType,
    });
})