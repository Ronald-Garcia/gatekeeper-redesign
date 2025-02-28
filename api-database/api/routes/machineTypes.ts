import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, asc, count, desc, eq, ilike, like, or, SQL } from "drizzle-orm";
import { machineTypes } from "../db/schema";
import { db } from "../db";
import { HTTPException } from "hono/http-exception"
import { queryTypesParamsSchema, validateTypeParamSchema } from "../validators/machineTypeSchema";


export const machineTypeRoutes = new Hono();


// Getting list of all machine types
machineTypeRoutes.get(
    "/machine-types",
    zValidator("param", validateTypeParamSchema),
    zValidator("query", queryTypesParamsSchema),
    async (c) => {
    const { machineType } = c.req.valid("param")
    const { page = 1, limit = 20, sort, search } = c.req.valid("query");
        const whereClause: (SQL | undefined)[] = [];

        // Check if a valid machine type first, throw 404 if not.
        const  [type]  = await db
        .select()
        .from(machineTypes)
        .where(eq(machineTypes.type, machineType));

        if (!type) {
            throw new HTTPException(404, { message: "Machine Type not found" });
        }

        // Get into searching
        if (search) {
            whereClause.push(
                ilike(machineTypes.type, `%${search}%`)
            );
        }
    
        const orderByClause: SQL[] = [];
    
        switch (sort) {
            case "type_desc":
                orderByClause.push(desc(machineTypes.type));
                break;
            case "type_asc":
                orderByClause.push(asc(machineTypes.type));
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
            data: allTypes,
            page,
            limit,
            total: totalCount,
        });
    });


// Add a machine type
machineTypeRoutes.post("/machine-types",
    zValidator("json", validateTypeParamSchema),
     async (c)=>{

    const { machineType } = c.req.valid("json");

    // Check if machine type already exists
    const  [type]  = await db
    .select()
    .from(machineTypes)
    .where(eq(machineTypes.type, machineType));

    if (type) {
        throw new HTTPException(409, { message: "Machine Type already exists" });
    }

    const newMachineType = await db
        .insert(machineTypes)
        .values({
            type: machineType
        })
        .returning();

    return c.json(newMachineType, 201);
})


// Remove a type of machine
machineTypeRoutes.delete("/machine-types",
    zValidator("json", validateTypeParamSchema),
     async (c)=>{

    const { machineType } = c.req.valid("json");

    // Check if a valid type first, throw 404 if not.
    const  [type]  = await db
    .select()
    .from(machineTypes)
    .where(eq(machineTypes.type, machineType));

    if (!type) {
        throw new HTTPException(404, { message: "Machine Type not found" });
    }

    const deletedTraining = await db
        .delete(machineTypes)
        .where(eq(machineTypes.type, machineType))
        .returning();

    return c.json(deletedTraining, 200);
})
