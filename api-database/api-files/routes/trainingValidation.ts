import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, asc, count, desc, eq, ilike, like, or, SQL } from "drizzle-orm";
import { machines, machineTypes, userMachineType, users } from "../db/schema.js";
import { db } from "../db/index.js";
import { HTTPException } from "hono/http-exception"
import { createTrainingSchema, getTrainingSchema, queryTrainingsParamsSchema, validateTrainingSchema, validateUserParamSchema } from "../validators/trainingSchema.js";


export const trainingRoutes = new Hono();

trainingRoutes.get(
    "/trainings/:userId/:machineId",
    zValidator(
        "param",
        validateTrainingSchema),
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

    
    const machineRelation = await db
        .select()
        .from(userMachineType)
        .where(and(eq(userMachineType.userId, userId), eq(userMachineType.id, machine.machineTypeId)))
    
    if (!machineRelation) {
        throw new HTTPException(401, { message: "User not authorized to use machine" });
    }

    //TODO give back a session for the user. Artic.
    throw new HTTPException(501, { message: "Have not implemented sessions for users yet." });
})


// Getting list of a student's current trainings by id.
trainingRoutes.get(
    "/trainings/:id",
    zValidator("param", validateUserParamSchema),
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

        // Get into searching
        // if (search) {
        //     whereClause.push(
        //         and(ilike(userMachineType.machineType, `%${search}%`), eq(userMachineType.userId, id))
        //     );
        // }
    
        const orderByClause: SQL[] = [];
    
        // switch (sort) {
        //     case "type_desc":
        //         orderByClause.push(desc(userMachineType.machineType));
        //         break;
        //     case "type_asc":
        //         orderByClause.push(asc(userMachineType.machineType));
        //         break;
        // }
    
        const offset = (page - 1) * limit;
    
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
        
        return c.json({
            sucess:true,
            data: allTrainings,
            meta: {
                page,
                limit,
                total: totalCount,
                },
            message:"Fetched user routes"
            });
    });


// Add trainings
trainingRoutes.post("/trainings",
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
        message:"Deleted training"
    }, 201)
})


// Remove trainings
//Sign up a user
trainingRoutes.delete("/trainings",
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
