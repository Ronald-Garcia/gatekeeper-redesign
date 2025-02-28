import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { like, SQL, or, desc, asc, eq, and, count, ilike } from "drizzle-orm";
import { db } from "../db/index.js";
import { HTTPException} from "hono/http-exception";
import { createMachineSchema, queryMachinesByNameSchema, queryMachinesByTypeSchema } from "../validators/machineSchema.js";
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

    const { name, machineType } = c.req.valid("json");

    //Insertion of new Budget Code
    const newBudgetCode = await db
        .insert(machines)
        .values({
            name,
            machineType
        })
        .returning();

    return c.json(newBudgetCode, 201);

})

//Delete a machine by id.
machineRoutes.delete("/trainings",
    zValidator("json", validateTrainingSchema),
     async (c)=>{

    const { userId, machineType } = c.req.valid("json");

    // Check if a valid user first, throw 404 if not.
    const  [user_ent]  = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

    if (!user_ent) {
        throw new HTTPException(404, { message: "User not found" });
    }

    const deletedTraining = await db
        .delete(userMachineType)
        .where(and(eq(userMachineType.userId, userId),eq(userMachineType.machineType, machineType)))
        .returning();

    return c.json(deletedTraining, 200);
})
