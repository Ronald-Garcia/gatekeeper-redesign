import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { userMachineType, users } from "../db/schema";
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
    const { machineType } = c.req.valid("json")
    const  [user_ent]  = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

    if (!user_ent) {
        throw new HTTPException(404, { message: "User not found" });
    }

    const id = user_ent.id
    
    const machineRelation = await db
        .select()
        .from(userMachineType)
        .where(and(eq(userMachineType.userId, id), eq(userMachineType.machineType, machineType)))
    
    if (!machineRelation) {
        throw new HTTPException(401, { message: "User not authorized to use machine" });
    }

    return c.json({sucess:true}, 200);

})