import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { queryUsersParamsSchema, createUserSchema, getUserSchema, testSchema, getUserByCardNumSchema } from "../validators/schemas.js";
import { like, SQL, or, desc, asc, eq, and, count } from "drizzle-orm";
import { users } from "../db/schema.js";
import { db } from "../db/index.js";
import { HTTPException} from "hono/http-exception";

/**
 * Routes for budget code operations.
 * @get     /users       querys all users stored in database.
 * @post    /users       creates a new user in the database.
 * @delete  /users/:id   deletes a budget code.
 */
export const userRoutes = new Hono();


/**
 * Queries all users stored in the database.
 * @query page         the page to query.
 * @query limit        the amount of entries per page.
 * @query search       search through the name and jhed of the users.
 * @query sort         sort by name, jhed, or year, ascending or descending.
 * @returns page of data.
 */
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
    sucess:true,
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

/**
 * Create a new user.
 * @body name               the name of the user
 * @body cardNum            the card number of the user
 * @body JHED               the jhed of the user.
 * @body graduationYear     the graduation year of the user.
 * @body isAdmin            whether or not the user is an admin.
 * @returns the newly created user.
 */
userRoutes.post("/users", zValidator("json", createUserSchema), async (c)=>{

    const { name, cardNum, JHED, graduationYear, isAdmin } = c.req.valid("json");

    const lastDigitOfCardNum = Number.parseInt(cardNum.charAt(cardNum.length - 1));
    //First, check if a user with that card number exists. If they do, send back an error.
    const [userCheck] = await db
    .select()
    .from(users)
    .where(eq(users.cardNum, cardNum))

    //If there is a user with that card number.
    if (userCheck) {

        if (userCheck.active === 1) {
            throw new HTTPException(409, { message: "User with this card number already exists." });
        }
        
        const [newUser] = await db.update(users).set({ active: 1 }).where(eq(users.id, userCheck.id)).returning();

        return c.json({
            success: true,
            message: "User has been created",
            data: newUser
        }, 201);
    }

    const newUser = await db
        .insert(users)
        .values({
            name:name,
            lastDigitOfCardNum,
            cardNum,
            JHED,
            isAdmin,
            graduationYear,
            active: 1
        })
        .returning();

    return c.json({
        success: true,
        message: "User has been created",
        data: newUser
    }, 201);
})

/**
 * Get user by card number.
 * @param cardNum the card number of the user.
 * @returns the user.
 */
userRoutes.get("/users/:cardNum", zValidator("param",getUserByCardNumSchema), async(c) => {
    //Given you have a well formed card number, check if that card num exists in user table.
    const { cardNum } = c.req.valid("param");

    const cardNumTrunc = cardNum.substring(0, cardNum.length - 1);

    const lastDigitOfCardNum = Number.parseInt(cardNum.charAt(cardNum.length - 1));
    let [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.cardNum, cardNumTrunc), eq(users.lastDigitOfCardNum, lastDigitOfCardNum)));
    
    // Check if exists. If not, throw error.
    // Also, do a check to see if this is an old jcard scan attempt. If yes, deny.
    if (!user || user.lastDigitOfCardNum > lastDigitOfCardNum || user.active === 0) {    
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

/**
 * Delete a user by id.
 * @param id the database ID of the user.
 * @returns the deleted user.
 */
userRoutes.delete(
    "/users/:id", 
    //authGuard,
    zValidator("param", getUserSchema),
    async (c)=>{
                
        const { id } = c.req.valid("param");
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
        
        
        if (!user) {
            throw new HTTPException(404, { message: "User not found" });
        }



        // if (no session) throw another error.
        // For now, no auth, just replace.
        const deletedUser = await db
        .update(users)
        .set({active: 0})
        .where(eq(users.id, id))
        .returning()

          return c.json(
            {
                success: true,
                message: "User has been deleted",
                data: deletedUser
            }
            );

})
