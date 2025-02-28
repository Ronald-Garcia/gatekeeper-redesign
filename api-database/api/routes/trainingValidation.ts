import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { machinesTable, userMachineRelation, usersTable } from "../db/schema";
import { db } from "../db";
import { HTTPException } from "hono/http-exception"
import { validateTrainingSchema } from "../validators/trainingSchema";


export const trainingRoutes = new Hono();


trainingRoutes.get(
    "./trainings",
    zValidator(
        "json",
        validateTrainingSchema),
    async (c) => {
    const { userId } = c.req.valid("json")
    const { machineId } = c.req.valid("json")
    const  [user_ent]  = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId));


    if (!user_ent) {
        throw new HTTPException(404, { message: "User not found" });
    }


    const id = user_ent.id
    const type = await db
        .select()
        .from(machinesTable)
        .where(eq(machinesTable.id, machineId))
   


   
    const machineRelation = await db
        .select()
        .from(userMachineRelation)
        .where(and(eq(userMachineRelation.userId, id), eq(userMachineRelation.machineId, machineId)))
   
    if (!machineRelation) {
        throw new HTTPException(401, { message: "User not authorized to use machine" });
    }


    return c.json({sucess:true}, 200);


})