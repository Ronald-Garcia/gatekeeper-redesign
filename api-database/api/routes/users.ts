import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryUsersParamsSchema, createUser, deleteUser } from "../validators/schemas";
import { like, SQL, or, desc, asc, eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import { db } from "../db/index";
import { HTTPException} from "hono/http-exception";


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
    return c.json( {"f":"f"} ,200);

})

//Sign up a user
userRoutes.post("/sign-up", zValidator("json", createUser), async (c)=>{

    const { name, lastDigitOfCardNum, cardNum, JHED, graduationYear, isAdmin } = c.req.valid("json");
    

    const newUser = await db
        .insert(usersTable)
        .values({
            name:name,
            lastDigitOfCardNum,
            cardNum,
            JHED,
            isAdmin,
            graduationYear
        })
        .returning();

    return c.json(newUser);
})
  


userRoutes.delete("/user", zValidator("json", deleteUser), async (c)=>{
    
})
