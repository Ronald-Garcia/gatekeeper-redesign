import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, asc, count, desc, eq, ilike, like, or, SQL } from "drizzle-orm";
import { machines, machineTypes, userMachineType, users } from "../db/schema.js";
import { db } from "../db/index.js";
import { HTTPException } from "hono/http-exception"
import { createTrainingSchema, getTrainingFromMachineSchema, getTrainingSchema, queryTrainingsParamsSchema, validateUserParamSchema } from "../validators/trainingSchema.js";
import { Context } from "../lib/context.js";
import { authGuard } from "../middleware/authGuard.js";
import { adminGuard } from "../middleware/adminGuard.js";


/**
 * Route to handle training operations.
 * @get     /trainings/:userId/:machineId   get a particular training between a user and a machine.
 * @get     /trainings/:id                  get all trainings of a particular user.
 * @post    /trainings/                     create a new training.
 * @delete  /trainings/                     delete a training.
 */
export const trainingRoutes = new Hono<Context>();

/**
 * Get a particular training between a user and a machine.
 * @param userId    the database ID of the user.
 * @param machineId the database ID of the machine.
 * @returns the relation.
 */
trainingRoutes.get(
    "/trainings/:userId/:machineId", 
    adminGuard,
    zValidator(
        "param",
        getTrainingFromMachineSchema),
    async (c) => {
    const { userId, machineId } = c.req.valid("param")
    const  [user_ent]  = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

    if (!user_ent) {
        throw new HTTPException(404, { message: "User not found" });
    }

    const [ machine ] = await db
        .select()
        .from(machines)
        .where(eq(machines.id, machineId));

    if (!machine) {
        throw new HTTPException(404, { message: "Machine not found." });
    }

    const [ machineType ] = await db
        .select()
        .from(machineTypes)
        .where(eq(machineTypes.id, machine.machineTypeId))

    if (!machineType) {
        throw new HTTPException(404, { message: "Machine type not found."});
    }

    const machineRelation = await db
        .select()
        .from(userMachineType)
        .where(and(eq(userMachineType.userId, userId), eq(userMachineType.machineTypeId, machineType.id)))
    
    if (!machineRelation || machineRelation.length === 0 ) {
        throw new HTTPException(401, { message: "User not authorized to use machine" });
    }

    
    return c.json({
      success: true,
      message: "Training validated"
    });
  }
);


/**
 * Get all the trainings of a user.
 * @param id           the database ID of the user.
 * @query page         the page to query.
 * @query limit        the amount of entries per page.
 * @query search       search through the name of the machine types.
 * @query sort         sort by type, ascending or descending.
 * @returns all the machine types the user is trained on.
 */
trainingRoutes.get(
    "/trainings/:id",
    zValidator("param", validateUserParamSchema), 
    //authGuard,
    adminGuard,
    zValidator("query", queryTrainingsParamsSchema),
    async (c) => {
    const { id } = c.req.valid("param")
    const { page = 1, limit = 20, sort, search } = c.req.valid("query");
        const whereClause: (SQL | undefined)[] = [];

        // Check if a valid user first, throw 404 if not.
        const  [user_ent]  = await db
        .select()
        .from(users)
        .where(eq(users.id, id));

        if (!user_ent) {
            throw new HTTPException(404, { message: "User not found" });
        }

        const userTrainings = await db.select().from(userMachineType).where(eq(userMachineType.userId, id));

        whereClause.push(and(...userTrainings.map(u => eq(machineTypes.id, u.machineTypeId))));
        // Get into searching
        if (search) {
            whereClause.push(
                and(ilike(machineTypes.name, `%${search}%`))
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
    
        let [allTrainings, totalCount] = [[], 0];

        if (userTrainings.length !== 0) {
            const [allTrainings, [{ totalCount }]] = await Promise.all([
                db
                .select()
                .from(userMachineType)
                .where(and(...whereClause))
                .orderBy(...orderByClause)
                .limit(limit)
                .offset(offset),
        
                  //This gets user count from database.
                db
                  .select({ totalCount: count() })
                  .from(userMachineType)
                  .where(and(...whereClause)),
              ]);    
        }
        return c.json({
            sucess:true,
            data: allTrainings,
            meta: {
                page,
                limit,
                total: totalCount,
                },
            message:"Fetched user trainings"
            });
    });


/**
 * Create a new training.
 * @body userId         the database ID of the user.
 * @body machineTypeId  the database ID of the machine type.
 * @returns the newly created training.
 */
trainingRoutes.post("/trainings", 
    adminGuard,
    zValidator("json", createTrainingSchema),
     async (c)=>{

    const { userId, machineTypeId } = c.req.valid("json");

    // Check if a valid user first, throw 404 if not.
    const  [user_ent]  = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

    if (!user_ent) {
        throw new HTTPException(404, { message: "User not found" });
    }

    const newTraining = await db
        .insert(userMachineType)
        .values({
            userId,
            machineTypeId
        })
        .returning();

    return c.json({
        sucess:true,
        data:newTraining,
        message:"Created training"
    }, 201)
})


/**
 * Delete a training.
 * @body userId the database ID of the user.
 * @body machineTypeId the database ID of the machine type.
 * @returns the deleted training.
 */
trainingRoutes.delete("/trainings", 
    adminGuard,
    zValidator("json", getTrainingSchema),
     async (c)=>{

    const { userId, machineTypeId } = c.req.valid("json");

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
        .where(and(eq(userMachineType.userId, userId),eq(userMachineType.id, machineTypeId)))
        .returning();

    return c.json({
        sucess:true,
        data:deletedTraining,
        message:"Deleted training"
    }, 200);
})
