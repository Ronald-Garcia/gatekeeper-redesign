import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryUsersParamsSchema, createUser, deleteUser } from "../validators/schemas";
import { like, SQL, or, desc, asc } from "drizzle-orm";
import { usersTable } from "../db/schema";



export const userRoutes = new Hono();



userRoutes.get("/users", zValidator("param", queryUsersParamsSchema), async (c) => {
    const { page = 1, limit = 20, sort, search } = c.req.valid("param");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(or(like(usersTable.name, search), like(usersTable.JHED, search)));
    }

    const orderByClause: SQL[] = [];

    switch (sort){
        case "name_desc" :
            orderByClause.push(desc(usersTable.name));
            break;
        case "name_asc" :
            orderByClause.push(asc(usersTable.name));
            break;
        case "year_asc" :
            orderByClause.push(desc(usersTable.graduationYear));
            break;
        case "year_desc" :
            orderByClause.push(asc(usersTable.graduationYear));
            break;
        case "jhed_asc" :
            orderByClause.push(desc(usersTable.JHED));
            break;
        case "jhed_desc" :
            orderByClause.push(asc(usersTable.JHED));
            break;

    }

})

userRoutes.post("/user", zValidator("json", createUser), async (c)=>{

})

userRoutes.delete("/user", zValidator("json", deleteUser), async (c)=>{
    
})
