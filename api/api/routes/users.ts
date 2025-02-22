import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryParamsSchema } from "../validators/schemas";
import { like, SQL, or } from "drizzle-orm";
import { usersTable } from "../db/schema";



export const userRoutes = new Hono();



userRoutes.get("./users", zValidator("param", queryParamsSchema), async (c) => {
    const { page = 1, limit = 20, sort, search } = c.req.valid("param");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(or(like(usersTable.name, search), like(usersTable.JHED, search)));
    }

    
})