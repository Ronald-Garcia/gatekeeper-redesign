import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, asc, count, desc, eq, ilike, like, or, SQL } from "drizzle-orm";
import { machines, machineTypes, userMachineType, users } from "../db/schema";
import { db } from "../db";
import { HTTPException } from "hono/http-exception"
import { queryTrainingsParamsSchema, validateTrainingSchema, validateUserParamSchema } from "../validators/trainingSchema";


export const trainingRoutes = new Hono();

trainingRoutes.get(
    "./trainings",
    zValidator(
        "json",
        validateTrainingSchema),
    async (c) => {
    const { userId } = c.req.valid("json")
    const { machineType } = c.req.valid("json")
    const  [user_ent]  = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

    if (!user_ent) {
        throw new HTTPException(404, { message: "User not found" });
    }

    const id = user_ent.id

        //Check if the machine they are requesting exists.
    const[machineTypeCheck] = await db
        .select()
        .from(machineTypes)
        .where(eq(machineTypes.type, machineType));
        
    if (!machineTypeCheck) {
        throw new HTTPException(404, { message: "Machine type not found" });
    }

    
    const machineRelation = await db
        .select()
        .from(userMachineType)
        .where(and(eq(userMachineType.userId, id), eq(userMachineType.machineType, machineType)))
    
    if (!machineRelation) {
        throw new HTTPException(401, { message: "User not authorized to use machine" });
    }

    //TODO give back a session for the user. Artic.
    throw new HTTPException(501, { message: "Have not implemented sessions for users yet." });
})


// Getting list of student's current trainings by id.
trainingRoutes.get(
    "./trainings/:id",
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
        if (search) {
            whereClause.push(
                and(ilike(userMachineType.machineType, `%${search}%`), eq(userMachineType.userId, id))
            );
        }
    
        const orderByClause: SQL[] = [];
    
        switch (sort) {
            case "type_desc":
                orderByClause.push(desc(userMachineType.machineType));
                break;
            case "type_asc":
                orderByClause.push(asc(userMachineType.machineType));
                break;
        }
    
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
            data: allTrainings,
            page,
            limit,
            total: totalCount,
        });
    });

    

// Add trainings
trainingRoutes.post("/trainings",
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

    const newTraining = await db
        .insert(userMachineType)
        .values({
            userId:userId,
            machineType:machineType
        })
        .returning();

    return c.json(newTraining, 201);
})


// Remove trainings
//Sign up a user
trainingRoutes.delete("/trainings",
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
