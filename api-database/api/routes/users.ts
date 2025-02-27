import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryUsersParamsSchema } from "../validators/schemas";
import { like, SQL, or, desc, asc } from "drizzle-orm";
import { users } from "../db/schema";



export const userRoutes = new Hono();



userRoutes.get("./users", zValidator("param", queryUsersParamsSchema), async (c) => {
    const { page = 1, limit = 20, sort, search } = c.req.valid("param");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(or(like(users.name, search), like(users.JHED, search)));
    }

    const orderByClause: SQL[] = [];

    switch (sort){
        case "name_desc" :
            orderByClause.push(desc(users.name));
            break;
        case "name_asc" :
            orderByClause.push(asc(users.name));
            break;
        case "year_asc" :
            orderByClause.push(desc(users.graduationYear));
            break;
        case "year_desc" :
            orderByClause.push(asc(users.graduationYear));
            break;
        case "jhed_asc" :
            orderByClause.push(desc(users.JHED));
            break;
        case "jhed_desc" :
            orderByClause.push(asc(users.JHED));
            break;

    }

})