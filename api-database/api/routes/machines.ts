import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { like, SQL, or, desc, asc, eq, and, count, ilike } from "drizzle-orm";
import { db } from "../db/index.js";
import { HTTPException} from "hono/http-exception";
import { createMachineSchema, queryMachinesByNameSchema, queryMachinesByTypeSchema, validateMachineIdSchema } from "../validators/machineSchema.js";
import { machines } from "../db/schema.js";



export const machineRoutes = new Hono();

// Search all current machines. If you want one type, search the type.
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
        data: allMachines,
        page,
        limit,
        total: totalCount,
    });
});

// Search all current machines. If you want one type, search the type.
machineRoutes.get("/machines/searchByType", zValidator("query", queryMachinesByTypeSchema), async (c) => {
    const { page = 1, limit = 20, search, sort } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(or(ilike(machines.machineType, `%${search}%`)));
    }

        const orderByClause: SQL[] = [];
    
        switch (sort) {
            case "type_desc":
                orderByClause.push(desc(machines.machineType));
                break;
            case "type_asc":
                orderByClause.push(asc(machines.machineType));
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
        data: allMachines,
        page,
        limit,
        total: totalCount,
    });
});

//Create a new machine given a machine type
machineRoutes.post("/machines", zValidator("json", createMachineSchema), async (c)=>{

    const { name, machineType, hourlyRate } = c.req.valid("json");

    //Insertion of new machine
    const newMachine = await db
        .insert(machines)
        .values({
            name,
            machineType,
            hourlyRate
        })
        .returning();

    return c.json(newMachine, 201);
})

//Create a new machine given a machine type by id.
machineRoutes.patch("/machines/:id",
zValidator("param", validateMachineIdSchema),
zValidator("json", createMachineSchema),
async (c)=>{

    const { id } = c.req.valid("param")
    const { name, machineType, hourlyRate } = c.req.valid("json");
    // Check if machine exists first, throw 404 if not.
    const  [machine_ent]  = await db
    .select()
    .from(machines)
    .where(eq(machines.id, id));

    if (!machine_ent) {
        throw new HTTPException(404, { message: "Machine not found" });
    }

    //Updating of machine

    const updatedMachine = await db
        .update(machines)
        .set({name,machineType,hourlyRate })
        .where(eq(machines.id, id))
        .returning();

    return c.json(updatedMachine, 201);
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

    return c.json(deletedMachine, 200);
})
