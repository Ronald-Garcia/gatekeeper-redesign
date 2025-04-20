import { Hono } from "hono";
import { budgetCodesRoutes } from "../../api-files/routes/budgetCodes.js";
import { userRoutes } from "../../api-files/routes/users.js";
import { db } from "../../api-files/db/index.js";
import { users, budgetCodes } from "../../api-files/db/schema.js";
import { eq, asc, desc, count, ilike, and } from "drizzle-orm";
import { Context } from "../../api-files/lib/context.js";
import { auth } from "../../api-files/middleware/auth.js";


// Admin login helper – exactly as in your training tests.
async function adminLogin(app: Hono<Context>): Promise<string> {
  const adminCardNum = "1234567890777777";
  const response = await app.request(`/users/${adminCardNum}`);
  if (response.status !== 200) {
    throw new Error("Admin login failed");
  }
  const setCookie = response.headers.get("set-cookie") || "";
  return setCookie.split(";")[0];
}

// User (non‑admin) login helper – logs error if login fails.
async function userLogin(app: Hono<Context>, cardNum: string): Promise<string> {
  const response = await app.request(`/users/${cardNum}`);
  if (response.status !== 200) {
    console.log(response)
    console.log(response.body)
    console.error("Non-admin login response:", await response.text());
    throw new Error("User login failed for cardNum=" + cardNum);
  }
  const setCookie = response.headers.get("set-cookie") || "";
  return setCookie.split(";")[0];
}

// Generate a unique 16‑digit card number (always starts with "999")
// (Concatenates "999" with a 13‑digit random number to yield 16 digits)
function generateTestCardNumber(): string {
  const randomPart = Math.floor(Math.random() * 1e13)
    .toString()
    .padStart(13, "0");
  return "999" + randomPart;
}

// app setup
const app = new Hono<Context>();
app.use("/*", auth);
app.route("/", userRoutes);
app.route("/", budgetCodesRoutes);
app.onError((err, c) => {
  return c.json(
    { message: err instanceof Error ? err.message : "Internal Server Error" },
    (err as any)?.status || 400
  );
});

// global variables
let adminCookie: string = "";
let testUserId: number;
let testBudgetCodeId: number;
let createdBudgetCodeId: number; // For deletion tests

//setup for all tests
beforeAll(async () => {
  // Log in as admin.
  adminCookie = await adminLogin(app);

  // Create a test user with a fixed 16‑digit card number.
  const testUserCard = generateTestCardNumber(); // 16 digits
  const [insertedUser] = await db.insert(users).values({
    name: "Test Budget User",
    cardNum: (testUserCard.slice(0, -1)),
    lastDigitOfCardNum: parseInt(testUserCard.slice(-1)),
    JHED: "budgetuser",
    isAdmin: 0,
    graduationYear: 2025,
    active: 1,
  }).returning();
  testUserId = insertedUser.id;

  // Create a test budget code.
  const randomBudgetName =
    "TEST_BUDGET_" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
  const randomBudgetCode =
    Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
  const [insertedBudget] = await db.insert(budgetCodes).values({
    name: randomBudgetName,
    code: randomBudgetCode,
    budgetCodeTypeId: 1
  }).returning();
  testBudgetCodeId = insertedBudget.id;
});

// test suite for budget codes
describe("Budget Codes Routes", () => {
  describe("GET /budget-codes", () => {
    test("returns 200 and a list of budget codes with pagination (admin access)", async () => {
      const response = await app.request(
        "/budget-codes?page=1&limit=20&sort=name_asc",
        { method: "GET", headers: { Cookie: adminCookie } }
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("data");
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty("meta");
      expect(body.meta).toHaveProperty("page", 1);
      expect(body.meta).toHaveProperty("limit", 20);
      expect(body).toHaveProperty("message", "Fetched budget codes");
    });

    test("returns 401 Unauthorized when no session is provided", async () => {
      const response = await app.request(
        "/budget-codes?page=1&limit=20&sort=name_asc",
        { method: "GET" }
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("POST /budget-codes", () => {
    test("creates a new budget code (admin access)", async () => {
      const newBudget = {
        name: "TEST_BUDGET_" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0"),
        code: Math.floor(Math.random() * 1e8).toString().padStart(8, "0"),
        budgetCodeTypeId: 1
      };
      const response = await app.request("/budget-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(newBudget),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Created new budget code");
      expect(body).toHaveProperty("data");
      // Save the created budget code ID for deletion tests.
      createdBudgetCodeId = body.data.id;
      expect(body.data.name).toBe(newBudget.name);
      expect(body.data.code).toBe(newBudget.code);
    });

    test("returns 401 Unauthorized when no session is provided", async () => {
      const newBudget = {
        name: "TEST_BUDGET_" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0"),
        code: Math.floor(Math.random() * 1e8).toString().padStart(8, "0"),
      };
      const response = await app.request("/budget-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBudget),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });

    test("returns 403 Forbidden when non-admin session is used", async () => {
     // non-admin login.
     const nonAdminLoginResponse = await app.request(`/users/1198347981913945`, {
      method: 'GET',
    });

    const nonAdminCookie = nonAdminLoginResponse.headers.get("set-cookie")?.split(";")[0] || "";
   


      const newBudget = {
        name: "TEST_BUDGET_" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0"),
        code: Math.floor(Math.random() * 1e8).toString().padStart(8, "0"),
      };
      const response = await app.request("/budget-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: nonAdminCookie },
        body: JSON.stringify(newBudget),
      });
      expect(response.status).toBe(403);
      const bodyRes = await response.json();
      expect(bodyRes).toHaveProperty("message", "Forbidden: Admins only");
    });
  });

  describe("DELETE /budget-codes/:id", () => {
    test("deletes a budget code and returns it (admin access)", async () => {
      // Use the budget code created in the POST test (createdBudgetCodeId)
      const response = await app.request(`/budget-codes/${createdBudgetCodeId}`, {
        method: "DELETE",
        headers: { Cookie: adminCookie },
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Deleted budget code");
      expect(body).toHaveProperty("data");
    });

    test("returns 404 when trying to delete a non-existent budget code", async () => {
      const response = await app.request("/budget-codes/9999999", {
        method: "DELETE",
        headers: { Cookie: adminCookie },
      });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Budget Code not found!");
    });

    test("returns 401 Unauthorized when no session is provided", async () => {
      const response = await app.request("/budget-codes/9999999", { method: "DELETE" });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });

    test("returns 403 Forbidden when a non-admin session is used", async () => {
      

      // non-admin login.
      const nonAdminLoginResponse = await app.request(`/users/1198347981913945`, {
        method: 'GET',
      });
      
      const nonAdminCookie = nonAdminLoginResponse.headers.get("set-cookie")?.split(";")[0] || "";
   
  
      const response = await app.request(`/budget-codes/9999999`, {
        method: "DELETE",
        headers: { Cookie: nonAdminCookie },
      });
      expect(response.status).toBe(403);
      const bodyRes = await response.json();
      expect(bodyRes).toHaveProperty("message", "Forbidden: Admins only");
    });
  });
});


describe("GET /budget-codes filtering", () => {
  test("filters by name search, active flag, and budgetTypeId (admin access)", async () => {
    // setup for filtering test
    const matchingName = "FILTER_ME_" + Math.floor(Math.random()*1e6);
    const nonMatchingName = "DO_NOT_FILTER_" + Math.floor(Math.random()*1e6);

    // matching code test active=1, type=1
    const [{ id: matchId }] = await db.insert(budgetCodes).values({
      name: matchingName,
      code: Math.floor(Math.random()*1e8).toString().padStart(8, "0"),
      budgetCodeTypeId: 1,
      active: 1,
    }).returning();

    //non-matching code tests with different name, inactive, type=2
    const [{ id: nonMatchId }] = await db.insert(budgetCodes).values({
      name: nonMatchingName,
      code: Math.floor(Math.random()*1e8).toString().padStart(8, "0"),
      budgetCodeTypeId: 2,
      active: 0,
    }).returning();

    // Fetch with all three filters at once.
    const url = `/budget-codes`
      + `?page=1&limit=10`
      + `&search=${encodeURIComponent("FILTER_ME")}`
      + `&active=1`
      + `&budgetTypeId=1`;
    const res = await app.request(url, {
      method: "GET",
      headers: { Cookie: adminCookie },
    });
    expect(res.status).toBe(200);
    const body = await res.json();

    // Only the matching budget code should appear
    const ids = body.data.map((b: any) => b.id);
    expect(ids).toContain(matchId);
    expect(ids).not.toContain(nonMatchId);

    
    await db.delete(budgetCodes).where(eq(budgetCodes.id, matchId)).execute();
    await db.delete(budgetCodes).where(eq(budgetCodes.id, nonMatchId)).execute();
  });
});


// clean test data
afterAll(async () => {
  await db.delete(budgetCodes).where(eq(budgetCodes.id, testBudgetCodeId)).execute();
  await db.delete(users).where(eq(users.id, testUserId)).execute();
  await (db.$client as any).end();
});
