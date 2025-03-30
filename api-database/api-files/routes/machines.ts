import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { like, SQL, or, desc, asc, eq, and, count, ilike, exists } from "drizzle-orm";
import { db } from "../db/index.js";
import { HTTPException} from "hono/http-exception";
import { createMachineSchema, getMachineSchema, queryMachinesSchema, validateMachineIdSchema } from "../validators/machineSchema.js";
import { machines, machineTypes } from "../db/schema.js";
import { Context } from "../lib/context.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { authGuard } from "../middleware/authGuard.js";



/**
 * Routes for machine operations.
 * @get     /machines           querys all machines stored in database.
 * @get     /machines/:id       gets a specific machine by database ID.
 * @post    /machines           creates a new machine in the database.
 * @delete  /machines/:id       deletes a machine.
 */
export const machineRoutes = new Hono<Context>();


/**
 * Queries all machines stored in the database.
 * @query page         the page to query.
 * @query limit        the amount of entries per page.
 * @query search       search through the name of the machines.
 * @query type         search through the type of the machines.
 * @query sort         sort by name or type, ascending or descending.
 * @returns page of data.
 */
machineRoutes.get("/machines",
    authGuard,  
    zValidator("query", queryMachinesSchema), async (c) => {
    const { page = 1, limit = 20, search, sort, type } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(ilike(machines.name, `%${search}%`));
    }

    if (type) {
        const types = await db
                                .select()
                                .from(machineTypes)
                                .where(ilike(machineTypes.name, `%${type}%`));

        whereClause.push(and(...types.map(t => eq(machines.machineTypeId, t.id))));
    }

        const orderByClause: SQL[] = [];
    
        switch (sort) {
            case "name_desc":
                orderByClause.push(desc(machines.name));
                break;
            case "name_asc":
                orderByClause.push(asc(machines.name));
                break;
            case "type_asc":
                orderByClause.push(asc(machineTypes.name));
                break;
            case "type_desc":
                orderByClause.push(desc(machineTypes.name));
        }

    const offset = (page - 1) * limit;

    const [allMachines, [{ totalCount }]] = await Promise.all([
        db
        .select()
        .from(machines)
        .innerJoin(machineTypes, eq(machineTypes.id, machines.machineTypeId))
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
        success:true,
        data: allMachines.map(data => data.machines_table),
        meta: {
            page,
            limit,
            total: totalCount,
            },
        message:"Fetched machines"
        });
});

/**
 * Gets a specific machine in the database.
 * @param id the database ID of the machine
 * @returns the machine.
 */
machineRoutes.get("/machines/:id",
     authGuard, 
     zValidator("param", getMachineSchema), async (c) => {

    const { id } = c.req.valid("param");

    const [machine] = await db
        .select()
        .from(machines)
        .where(eq(machines.id, id));

    if (!machine) {
        throw new HTTPException(404, { message: "Machine not found!"});
    }
    if (machine.active == 0) {
        throw new HTTPException(503, {message: "Machine is not open for use."});
    }

    return c.json({
        success: true,
        message: "Machine found!",
        data: machine
    });
})


/**
 * Creates a new machine in the database.
 * @body name           the name of the new machine.
 * @body machineTypeId  the type of the machine.
 * @body hourlyRate     the rate of the machine.
 * @returns the newly created machine.
 */
machineRoutes.post("/machines", 
    adminGuard,
    zValidator("json", createMachineSchema), async (c)=>{

    const { name, machineTypeId, hourlyRate, active } = c.req.valid("json");
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
            active,
            hourlyRate
        })
        .returning();

    return c.json({
        success:true,
        message:"Created a machine",
        data: newMachine
    }, 201);
})

/**
 * Update a particular machine in the database.
 * @param id            the database ID of the machine
 * @body name           the new name of the machine.
 * @body machineTypeId  the new type of the machine.
 * @body hourlyRate     the new rate of the machine.
 * @returns the newly updated machine.
 */
machineRoutes.patch("/machines/:id", 
adminGuard,
zValidator("param", validateMachineIdSchema),
zValidator("json", createMachineSchema),
async (c)=>{

    const { id } = c.req.valid("param")
    const { name, machineTypeId, hourlyRate, active } = c.req.valid("json");
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
        .set({name,machineTypeId,hourlyRate,active })
        .where(eq(machines.id, id))
        .returning();

    return c.json({
        success:true,
        message:"Updated a machine",
        data: updatedMachine
    }, 201);
})


/**
 * Delete a particular machine in the database.
 * @param id the database ID of the machine.
 * @returns the deleted machine.
 */
machineRoutes.delete("/machines/:id", 
    adminGuard,
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
        success:true,
        message:"Deleted a machine",
        data: deletedMachine
    }, 200);
})
