import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryUsersParamsSchema, createUserSchema, validateUserSchema, getUserSchema } from "../validators/schemas";
import { like, SQL, or, desc, asc, eq } from "drizzle-orm";
import { budgetCodes, machinesTable, machineTypes, userMachineTable, usersTable } from "../db/schema";
import { db } from "../db/index";
import { HTTPException} from "hono/http-exception";


export const userRoutes = new Hono();



userRoutes.get("/users", zValidator("param", queryUsersParamsSchema), async (c) => {
    const { page = 1, limit = 20, sort, search } = c.req.valid("param");

    const whereClause: (SQL | undefined)[] = [];

    if (search) {
        whereClause.push(or(like(usersTable.name, `%${search}%`), like(usersTable.JHED, search)));
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
userRoutes.post("/users", zValidator("json", createUserSchema), async (c)=>{

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

// userRoutes.patch

// Check if a user is valid for a machine.
// TODO: Create and give them a session token when we do authentication.
userRoutes.post("/validate-user", zValidator("json",validateUserSchema), async(c) => {
    //Given you have a well formed card number, check if that card num exists in user table.
    const {cardNum, lastDigitOfCardNum, machineId} = c.req.valid("json");
    var [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.cardNum, cardNum));
    
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
            .update(usersTable)
            .set({lastDigitOfCardNum})
            .where(eq(usersTable.id, user.id))
            .returning();
    }

    //Check if the machine they are requesting exists.
    const[machine] = await db
        .select()
        .from(machinesTable)
        .where(eq(machinesTable.id, machineId));
    if (!machine) {
        throw new HTTPException(404, { message: "Machine not found" });
    }

    //Once we have our user and updated card if needed, check their credentials for the machine in user-machine table.
    const [relation] = await db
        .select()
        .from(userMachineTable)
        .where(eq(userMachineTable.userId, user.id) && eq(userMachineTable.machineId, machineId));

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
        .from(usersTable)
        .where(eq(usersTable.id, userId))
    
    
    if (!user) {
        throw new HTTPException(404, { message: "User not found" });
    }

    // if (no session) throw another error.
    // For now, no auth, just replace.
    const deletedUser = await db
    .delete(usersTable)
    .where(eq(usersTable.id, userId))
    .returning()

  return c.json(deletedUser);

})
