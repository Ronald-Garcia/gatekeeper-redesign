import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryUsersParamsSchema, createUserSchema, validateUserSchema, getUserSchema, testSchema } from "../validators/schemas.js";
import { like, SQL, or, desc, asc, eq, and, count } from "drizzle-orm";
import { budgetCodes, machines, machineTypes, userMachineType, users } from "../db/schema.js";
import { db } from "../db/index.js";
import { HTTPException} from "hono/http-exception";


export const userRoutes = new Hono();



userRoutes.get("/users", zValidator("query", queryUsersParamsSchema), async (c) => {
    const { page = 1, limit = 20, sort, search } = c.req.valid("query");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(
            or(like(users.name, `%${search}%`), like(users.JHED, `%${search}%`))
        );
    }

    const orderByClause: SQL[] = [];

    switch (sort) {
        case "name_desc":
            orderByClause.push(desc(users.name));
            break;
        case "name_asc":
            orderByClause.push(asc(users.name));
            break;
        case "year_desc":
            orderByClause.push(desc(users.graduationYear));
            break;
        case "year_asc":
            orderByClause.push(asc(users.graduationYear));
            break;
        case "jhed_desc":
            orderByClause.push(desc(users.JHED));
            break;
        case "jhed_asc":
            orderByClause.push(asc(users.JHED));
            break;
    }

    const offset = (page - 1) * limit;

    const [allUsers, [{ totalCount }]] = await Promise.all([
        db
        .select({
            id: users.id,
            name: users.name,
            cardNum: users.cardNum,
            lastDigitOfCardNum: users.lastDigitOfCardNum,
            JHED: users.JHED,
            isAdmin: users.isAdmin,
            graduationYear: users.graduationYear
        })
          .from(users)
          .where(and(...whereClause))
          .orderBy(...orderByClause)
          .limit(limit)
          .offset(offset),

          //This gets user count from database.
        db
          .select({ totalCount: count() })
          .from(users)
          .where(and(...whereClause)),
      ]);
    
    return c.json({
        data: allUsers,
        page,
        limit,
        total: totalCount,
    });
});

//Get user by id route as well.

//Test route
userRoutes.post("/testing", zValidator("json", testSchema), async (c)=>{
    const { id } = c.req.valid("json");

    throw new HTTPException(404, { message: "User not found" });

})

//Sign up a user
userRoutes.post("/users", zValidator("json", createUserSchema), async (c)=>{

    const { name, lastDigitOfCardNum, cardNum, JHED, graduationYear, isAdmin } = c.req.valid("json");

    //First, check if a user with that card number exists. If they do, send back an error.
    const [userCheck] = await db
    .select()
    .from(users)
    .where(eq(users.cardNum, cardNum))

    //If there is a user with that card number.
    if(userCheck){
        throw new HTTPException(409, { message: "User with this card number already exists." });
    }

    const newUser = await db
        .insert(users)
        .values({
            name:name,
            lastDigitOfCardNum,
            cardNum,
            JHED,
            isAdmin,
            graduationYear
        })
        .returning();

    return c.json(newUser, 201);
})

// userRoutes.patch

// Check if a user is valid for a machine.
// TODO: Create and give them a session token when we do authentication.
// TODO DELETE this ROUTE
userRoutes.post("/validate-user", zValidator("json",validateUserSchema), async(c) => {
    //Given you have a well formed card number, check if that card num exists in user table.
    const {cardNum, lastDigitOfCardNum, machineId} = c.req.valid("json");
    var [user] = await db
        .select()
        .from(users)
        .where(eq(users.cardNum, cardNum));
    
    // Check if exists. If not, throw error.
    if (!user) {    
        throw new HTTPException(404, { message: "User not found" });
    }
    // Also, do a check to see if this is an old jcard scan attempt. If yes, deny.
    // We should make this happen at same time as other check to avoid distinguishing time of response.
    if (user.lastDigitOfCardNum > lastDigitOfCardNum) {
        throw new HTTPException(404, { message: "User not found" });
    }

    // Check for a more recent jcard num. In this case, we will update the last digit with the new digit
    if (user.lastDigitOfCardNum > lastDigitOfCardNum) {
        [user] = await db
            .update(users)
            .set({lastDigitOfCardNum})
            .where(eq(users.id, user.id))
            .returning();
    }

    //Check if the machine they are requesting exists.
    const[machine] = await db
        .select()
        .from(machines)
        .where(eq(machines.id, machineId));
    if (!machine) {
        throw new HTTPException(404, { message: "Machine not found" });
    }

    //Once we have our user and updated card if needed, check their credentials for the machine in user-machine table.
    const [relation] = await db
        .select()
        .from(userMachineType)
        .where(and(eq(userMachineType.userId, user.id), eq(userMachineType.machineType, machine.machineType)));

    if (!relation) {
        throw new HTTPException(403, { message: "User does not have access to given machine" });
    }

    //TODO: Create a session token and return it.
    //For now, we will throw unimplemented.
    throw new HTTPException(501, { message: "Have not implemented sessions for users yet." });

})

userRoutes.delete("/users/:id", 
    //authGuard,
    zValidator("param", getUserSchema), async (c)=>{
    const {userId} = c.req.valid("param");
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
    
    
    if (!user) {
        throw new HTTPException(404, { message: "User not found" });
    }

    // if (no session) throw another error.
    // For now, no auth, just replace.
    const deletedUser = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning()

  return c.json(deletedUser);

})
