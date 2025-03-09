import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { like, SQL, or, desc, asc, eq, and, count, ilike, exists } from "drizzle-orm";
import { db } from "../db/index.js";
import { HTTPException} from "hono/http-exception";
import { createMachineSchema, getMachineSchema, queryMachinesByNameSchema, queryMachinesByTypeSchema, validateMachineIdSchema } from "../validators/machineSchema.js";
import { machines, machineTypes } from "../db/schema.js";



export const machineRoutes = new Hono();

// Search all current machines by name
machineRoutes.get("/machines/searchByName", zValidator("query", queryMachinesByNameSchema), async (c) => {
    const { page = 1, limit = 20, search, sort } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(or(ilike(machines.name, `%${search}%`)));
    }

        const orderByClause: SQL[] = [];
    
        switch (sort) {
            case "name_desc":
                orderByClause.push(desc(machines.name));
                break;
            case "name_asc":
                orderByClause.push(asc(machines.name));
                break;
        }

    const offset = (page - 1) * limit;

    const [allMachines, [{ totalCount }]] = await Promise.all([
        db
        .select()
        .from(machines)
        .where(and(...whereClause))
        .orderBy(...orderByClause)
        .limit(limit)
        .offset(offset),

          //This gets machine count from database.
        db
          .select({ totalCount: count() })
          .from(machines)
          .where(and(...whereClause)),
      ]);
    
    return c.json({
        sucess:true,
        data: allMachines,
        meta: {
            page,
            limit,
            total: totalCount,
            },
        message:"Fetched machines by name"
        });
});

// Search all current machines by type
machineRoutes.get("/machines/searchByType", zValidator("query", queryMachinesByTypeSchema), async (c) => {
    const { page = 1, limit = 20, search, sort } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(or(ilike(machineTypes.type, `%${search}%`)));
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

    const [allMachines, [{ totalCount }]] = await Promise.all([
        db
        .select()
        .from(machines)
        .where(
            exists(db.select().from(machineTypes).where(and(...whereClause)).orderBy(...orderByClause)))
        .limit(limit)
        .offset(offset),

        //This gets machine count from database.
        db
          .select({ totalCount: count() })
          .from(machines)
          .where(exists(db.select().from(machineTypes).where(and(...whereClause)))),
      ]);
    
    return c.json({
        sucess:true,
        data: allMachines,
        meta: {
            page,
            limit,
            total: totalCount,
            },
        message:"Fetched machines by type."
        });
});

machineRoutes.get("/machines/:id", zValidator("param", getMachineSchema), async (c) => {

    const { id } = c.req.valid("param");

    const [machine] = await db
        .select()
        .from(machines)
        .where(eq(machines.id, id));

    if (!machine) {
        throw new HTTPException(404, { message: "Machine not found!"});
    }

    return c.json({
        success: true,
        message: "Machine found!",
        data: machine
    });
})

//Create a new machine given a machine type
machineRoutes.post("/machines", zValidator("json", createMachineSchema), async (c)=>{

    const { name, machineTypeId, hourlyRate } = c.req.valid("json");
    //Check if machine type actually exists exists
    const [machineTypeCheck] = await db
        .select()
        .from(machineTypes)
        .where(eq(machineTypes.id, machineTypeId))
    
    if (!machineTypeCheck) {
        throw new HTTPException(404, { message: "Invalid machine type" });
    }

    //Insertion of new machine
    const [newMachine] = await db
        .insert(machines)
        .values({
            name,
            machineTypeId,
            hourlyRate
        })
        .returning();

    return c.json({
        sucess:true,
        message:"Created a machine",
        data: newMachine
    }, 201);
})

//Update a machine given an id.
machineRoutes.patch("/machines/:id",
zValidator("param", validateMachineIdSchema),
zValidator("json", createMachineSchema),
async (c)=>{

    const { id } = c.req.valid("param")
    const { name, machineTypeId, hourlyRate } = c.req.valid("json");
    // Check if machine exists first, throw 404 if not.
    const  [machine_ent]  = await db
    .select()
    .from(machines)
    .where(eq(machines.id, id));

    if (!machine_ent) {
        throw new HTTPException(404, { message: "Machine not found" });
    }

    if (machineTypeId) {
        //Check if machine type actually exists, if provided.
        const [machineTypeCheck] = await db
            .select()
            .from(machineTypes)
            .where(eq(machineTypes.id, machineTypeId))
        
        if (!machineTypeCheck) {
            throw new HTTPException(404, { message: "Invalid machine type" });
        }
    }

    //Updating of machine

    const updatedMachine = await db
        .update(machines)
        .set({name,machineTypeId,hourlyRate })
        .where(eq(machines.id, id))
        .returning();

    return c.json({
        sucess:true,
        message:"Updated a machine",
        data: updatedMachine
    }, 201);
})

//Delete a machine by id.
machineRoutes.delete("/machines/:id",
    zValidator("param", validateMachineIdSchema),
     async (c)=>{

    const { id } = c.req.valid("param");

    // Check if machine exists first, throw 404 if not.
    const  [machine_ent]  = await db
    .select()
    .from(machines)
    .where(eq(machines.id, id));

    if (!machine_ent) {
        throw new HTTPException(404, { message: "Machine not found" });
    }

    const deletedMachine = await db
        .delete(machines)
        .where(eq(machines.id, id))
        .returning();

    return c.json({
        sucess:true,
        message:"Deleted a machine",
        data: deletedMachine
    }, 200);
})
