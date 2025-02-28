import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
<<<<<<< HEAD:api/api/routes/trainingValidation.ts
import { machinesTable, userMachineRelation, usersTable } from "../db/schema";
=======
import { userMachineType, users } from "../db/schema";
>>>>>>> ea5bf9bfab6e341c9e2726fbc5fcedefcbca1ac2:api-database/api/routes/trainingValidation.ts
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
    const type = await db
        .select()
        .from(machinesTable)
        .where(eq(machinesTable.id, machineId))
    

    
    const machineRelation = await db
        .select()
        .from(userMachineType)
        .where(and(eq(userMachineType.userId, id), eq(userMachineType.machineType, machineType)))
    
    if (!machineRelation) {
        throw new HTTPException(401, { message: "User not authorized to use machine" });
    }

    return c.json({sucess:true}, 200);

})