import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, asc, count, desc, eq, ilike, like, or, SQL } from "drizzle-orm";
import { machineTypes } from "../db/schema";
import { db } from "../db";
import { HTTPException } from "hono/http-exception"
import { queryTypesParamsSchema, updateTypeSchema, validateTypeParamSchema, validateTypeSchema } from "../validators/machineTypeSchema";


export const machineTypeRoutes = new Hono();


// Getting list of all machine types
machineTypeRoutes.get(
    "/machine-types",
    zValidator("query", queryTypesParamsSchema),
    async (c) => {
    const { page = 1, limit = 20, sort, search } = c.req.valid("query");
        const whereClause: (SQL | undefined)[] = [];

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
            sucess:true,
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


// Add a machine type
machineTypeRoutes.post("/machine-types",
    zValidator("json", validateTypeSchema),
     async (c)=>{

    const { machineType } = c.req.valid("json");

    // Check if machine type already exists
    const  [type]  = await db
    .select()
    .from(machineTypes)
    .where(ilike(machineTypes.type, machineType));

    if (type) {
        throw new HTTPException(409, { message: "Machine Type already exists" });
    }

    const newMachineType = await db
        .insert(machineTypes)
        .values({
            type: machineType
        })
        .returning();

    return c.json({
        sucess:true,
        message:"Created a new machine type",
        data: newMachineType
    }, 201);
})


// Remove a type of machine
machineTypeRoutes.delete("/machine-types/:machineType",
    zValidator("param", validateTypeParamSchema),
     async (c)=>{

    const { machineType } = c.req.valid("param");

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

    return c.json({
        sucess:true,
        message:"Deleted a training",
        data: deletedTraining
    }, 200);
})

// Update a type of machine
machineTypeRoutes.patch("/machine-types/:machineType",
    zValidator("param", validateTypeParamSchema),
    zValidator("json", updateTypeSchema),
     async (c)=>{

    const { machineType } = c.req.valid("param");
    const { updateType } = c.req.valid("json");

    // Check if a valid type first, throw 404 if not.
    const  [type]  = await db
    .select()
    .from(machineTypes)
    .where(eq(machineTypes.type, machineType));

    if (!type) {
        throw new HTTPException(404, { message: "Machine Type not found" });
    }

    const updatedMachineType = await db
    .update(machineTypes)
    .set({ type: updateType })
    .where(eq(machineTypes.type, machineType))
    .returning()

    return c.json({
        success: true,
        message: "Deck updated successfully",
        data: updatedMachineType,
    });
})