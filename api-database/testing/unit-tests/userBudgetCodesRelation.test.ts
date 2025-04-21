import { Hono } from 'hono';
import { userBudgetCodeRelationRoute } from '../../api-files/routes/userBudgetCodeRelations.js';
import { userRoutes } from '../../api-files/routes/users.js';
import { db } from '../../api-files/db/index.js';
import { users, budgetCodes, userBudgetCodeTable } from '../../api-files/db/schema.js';
import { eq, like, and } from 'drizzle-orm';
import { Context } from '../../api-files/lib/context.js';
import { auth } from '../../api-files/middleware/auth.js';
import { HTTPException } from 'hono/http-exception';

// helper to login 
async function adminLogin(app: Hono<Context>): Promise<string> {
  const response = await app.request(`/users/1234567890777777`);
  if (response.status !== 200) {
    throw new HTTPException(407, { message: "Admin login failed" });
  }
  const setCookie = response.headers.get("set-cookie") || "";
  return setCookie.split(";")[0];
}

/// login normal user
async function userLogin(app: Hono<Context>, cardNum: string): Promise<string> {
  const response = await app.request(`/users/${cardNum}`);
  if (response.status !== 200) {
    throw new HTTPException(407, { message: `User login failed for cardNum=${cardNum}` });
  }
  const setCookie = response.headers.get("set-cookie") || "";
  return setCookie.split(";")[0];
}

// helper to generate dummy test card numbers
function generateTestCardNumber(): string {
  const randomPart = Math.floor(Math.random() * 1e13).toString().padStart(13, '0');
  return "999" + randomPart;
}


// helper to generate dummy test budget codes
function generateTestBudgetCodeName(): string {
  return "TEST_BUDGET_" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
}

// generate random test codes
function generateTestBudgetCode(): string {
  return Math.floor(Math.random() * 1e8).toString().padStart(8, '0');
}

// hono setup 
const app = new Hono<Context>();
app.use("/*", auth);
app.route('/', userRoutes);                  
app.route('/', userBudgetCodeRelationRoute); 

// Global test data
let adminCookie: string = "";
let userCookie: string = "";   //non-admin user cookie
let userIdForGet: number;      //for GET route tests non admin tests
let userCardForGet: string;    // card number for the non-admin user
let userIdForBudgets: number;  //for admin-protected routes
let testBudgetCodeId: number;
let additionalBudgetCodeId: number; // used in PATCH
let invalidUserId = 9999999;      


// error handler 
app.onError((err, c) => {
  return c.json(
    { message: err instanceof Error ? err.message : "Internal Server Error" },
    (err as any)?.status || 400
  );
});

// setup for tests
beforeAll(async () => {
  // Log in as admin
  adminCookie = await adminLogin(app);



  //Log in as that non-admin user
  userCookie = await userLogin(app, "1198347981913945");

  // second user for the budget-codes relation tested by admin routes
  const secondUserCard = generateTestCardNumber();
  const [insertedUser] = await db.insert(users)
    .values({
      name: "BudgetOwner",
      cardNum: secondUserCard.substring(0, secondUserCard.length - 1),
      lastDigitOfCardNum: parseInt(secondUserCard.slice(-1)),
      JHED: "budgetowner",
      isAdmin: 0,
      graduationYear: 2025,
      active: 1
    })
    .returning();
  userIdForBudgets = insertedUser.id;

  //Insert a budget code for relations
  const [insertedBudget] = await db.insert(budgetCodes)
    .values({
      name: generateTestBudgetCodeName(),
      code: generateTestBudgetCode(),
      budgetCodeTypeId:1
    })
    .returning();
  testBudgetCodeId = insertedBudget.id;

  //Insert a second budget code for PATCH
  const [insertedBudget2] = await db.insert(budgetCodes)
    .values({
      name: generateTestBudgetCodeName(),
      code: generateTestBudgetCode(),
      budgetCodeTypeId:1
    })
    .returning();
  additionalBudgetCodeId = insertedBudget2.id;
});

// tests 
describe("User Budget Code Relation Routes", () => {

  describe("GET /user-budgets/:id", () => {
    test("returns 200 with a list of budget codes (auth required, non-admin user)", async () => {
      //  create a relation for the GET user
      await db.insert(userBudgetCodeTable)
        .values({ userId: 179, budgetCodeId: testBudgetCodeId });

      const response = await app.request(
        `/user-budgets/${179}?page=1&limit=20`,
        { method: "GET", headers: { Cookie: userCookie } }
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty("meta");
      expect(body.meta).toHaveProperty("limit", 20);
      expect(body).toHaveProperty("message", "Fetched user budget codes");
    });

    test("returns 404 if user is not found", async () => {
      const response = await app.request(
        `/user-budgets/${invalidUserId}?page=1&limit=20`,
        { method: "GET", headers: { Cookie: userCookie } }
      );
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toContain("User not found");
    });

    test("returns 401 if no session is provided", async () => {
      const response = await app.request(`/user-budgets/${179}?page=1&limit=20`);
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("POST /user-budgets", () => {
    test("creates a user-budget relation (admin access)", async () => {
      const newRelation = { userId: userIdForBudgets, budgetCodeId: testBudgetCodeId };
      const res = await app.request("/user-budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(newRelation),
      });
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body).toHaveProperty("success", true);
      const returned = body.data;
      expect(returned).toMatchObject(newRelation);
    });

    test("returns 403 if session is non-admin", async () => {
      const newRelation = { userId: userIdForBudgets, budgetCodeId: testBudgetCodeId };
      const nonAdminResponse = await app.request("/user-budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: userCookie },
        body: JSON.stringify(newRelation),
      });
      expect(nonAdminResponse.status).toBe(403);
      const body = await nonAdminResponse.json();
      expect(body).toHaveProperty("message", "Forbidden: Admins only");
    });

    test("returns 401 if no session is provided", async () => {
      const noSession = await app.request("/user-budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userIdForBudgets, budgetCodeId: testBudgetCodeId })
      });
      expect(noSession.status).toBe(401);
      const bodyNoSession = await noSession.json();
      expect(bodyNoSession).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("DELETE /user-budgets/:userId/:budgetCodeId", () => {
    let createdUserId: number;
    let createdBudgetCodeId: number;

    beforeAll(async () => {
      // Create a user-budget relation to be deleted
      const [relation] = await db.insert(userBudgetCodeTable)
        .values({ userId: userIdForBudgets, budgetCodeId: testBudgetCodeId })
        .returning();
      createdUserId = relation.userId;
      createdBudgetCodeId = relation.budgetCodeId;
    });

    test("deletes a user-budget relation (admin access)", async () => {
      const res = await app.request(`/user-budgets/${createdUserId}/${createdBudgetCodeId}`, {
        method: "DELETE",
        headers: { Cookie: adminCookie }
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Deleted user-budget relation");
    });

    test("returns 403 if session is non-admin", async () => {
      // Attempt to delete something new with non-admin
      const newRelation = await db.insert(userBudgetCodeTable)
        .values({ userId: userIdForBudgets, budgetCodeId: additionalBudgetCodeId })
        .returning();
      const delRes = await app.request(
        `/user-budgets/${newRelation[0].userId}/${newRelation[0].budgetCodeId}`,
        { method: "DELETE", headers: { Cookie: userCookie } }
      );
      expect(delRes.status).toBe(403);
      const delBody = await delRes.json();
      expect(delBody).toHaveProperty("message", "Forbidden: Admins only");
    });

    test("returns 401 if no session is provided", async () => {
      const res = await app.request(
        `/user-budgets/${userIdForBudgets}/${testBudgetCodeId}`,
        { method: "DELETE" }
      );
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });

    test("returns 404 if user-budget relation not found", async () => {
      //Attempt to delete a (userId,budgetCodeId) combo that doesn't exist
      const res = await app.request(`/user-budgets/${userIdForBudgets}/9999999`, {
        method: "DELETE",
        headers: { Cookie: adminCookie }
      });
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body).toHaveProperty("message", "User budget relation not found.");
    });
  });

  describe("PATCH /user-budgets/:id", () => {
    test("replaces all budget codes (admin access)", async () => {
      // update info
      const updatePayload = { budget_code: [testBudgetCodeId, additionalBudgetCodeId] };
      const res = await app.request(`/user-budgets/${userIdForBudgets}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(updatePayload),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Successfully replaced budget codes of user.");
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data).toHaveLength(updatePayload.budget_code.length);
    });

    test("returns 404 if user is not found", async () => {
      const updatePayload = { budget_code: [testBudgetCodeId] };
      const res = await app.request(`/user-budgets/${invalidUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(updatePayload),
      });
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body).toHaveProperty("message", "No user found.");
    });

    test("returns 400 if we fail to insert all budget codes (simulate mismatch)", async () => {

    
      const updatePayload = { budget_code: [testBudgetCodeId, 99999999] }; // invalid budget code ID
      const res = await app.request(`/user-budgets/${userIdForBudgets}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(updatePayload),
      });
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty("message", "Unsuccessful in replacing all budget codes");
    });

    test("returns 403 if session is non-admin", async () => {
      const updatePayload = { budget_code: [testBudgetCodeId] };
      const res = await app.request(`/user-budgets/${userIdForBudgets}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: userCookie },
        body: JSON.stringify(updatePayload),
      });
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body).toHaveProperty("message", "Forbidden: Admins only");
    });

    test("returns 401 if no session is provided", async () => {
      const updatePayload = { budget_code: [testBudgetCodeId] };
      const res = await app.request(`/user-budgets/${userIdForBudgets}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });
  });
});

// delete test data from db
afterAll(async () => {
  await db.delete(userBudgetCodeTable).where(eq(userBudgetCodeTable.userId, 179)).execute();
  await db.delete(userBudgetCodeTable).where(eq(userBudgetCodeTable.userId, userIdForBudgets)).execute();
  await db.delete(users).where(eq(users.id, userIdForBudgets)).execute();
  await db.delete(budgetCodes).where(like(budgetCodes.name, "TEST_BUDGET_%")).execute();
  await (db.$client as any).end();
});
