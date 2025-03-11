import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryUsersParamsSchema, createUserSchema, getUserSchema, testSchema, getUserByCardNumSchema } from "../validators/schemas.js";
import { like, SQL, or, desc, asc, eq, and, count } from "drizzle-orm";
import { users } from "../db/schema.js";
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
    
    return c.json(
    {
    success:true,
    data: allUsers,
    meta: {
        page,
        limit,
        total: totalCount,
        },
    message:"Fetched user routes"
    }
);
});


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

    return c.json({
        success: true,
        message: "User created",
        data: newUser
    }, 201);
})

// Get user by card num and last digit of card num
userRoutes.get("/users/:cardNum/:lastDigitOfCardNum", zValidator("param",getUserByCardNumSchema), async(c) => {
    //Given you have a well formed card number, check if that card num exists in user table.
    const {cardNum, lastDigitOfCardNum} = c.req.valid("param");
    var [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.cardNum, cardNum), eq(users.lastDigitOfCardNum, lastDigitOfCardNum)));
    
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

    return c.json({
        success: true,
        message: "User has been validated in",
        data: user
    })
})

//Delete a user by id.
userRoutes.delete(
    "/users/:userId", 
    //authGuard,
    zValidator("param", getUserSchema),
    async (c)=>{
                
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

          return c.json(
            {
                success: true,
                message: "User has been deleted",
                data: deletedUser
            }
            );

})


