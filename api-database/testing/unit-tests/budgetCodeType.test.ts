import { Hono } from 'hono';
import { userRoutes } from '../../api-files/routes/users.js';
import { budgetCodeTypeRoutes } from '../../api-files/routes/budgetCodeTypes.js';
import { db } from '../../api-files/db/index.js';
import { budgetCodeType } from '../../api-files/db/schema.js';
import { eq, like } from 'drizzle-orm';
import { Context } from '../../api-files/lib/context.js';
import { auth } from '../../api-files/middleware/auth.js';
import { HTTPException } from 'hono/http-exception';

// Helper to simulate an admin login via the test admin card number
async function adminLogin(app: Hono<Context>): Promise<string> {
  const adminCardNum = "1234567890777777";
  const response = await app.request(`/users/${adminCardNum}`);
  if (response.status !== 200) {
    throw new HTTPException(500, { message: "Admin login failed" });
  }
  const setCookie = response.headers.get("set-cookie") || "";
  return setCookie.split(";")[0];
}

// Generate a unique budget code type name
function generateTestBudgetCodeTypeName(): string {
  return "TEST_BUDGET_CODE_TYPE_" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
}

// Set up Hono with userRoutes (for login) and budgetCodeTypeRoutes
const app = new Hono<Context>();
app.use("/*", auth);
app.route("/", userRoutes);
app.route("/", budgetCodeTypeRoutes);
app.onError((err, c) => {
  return c.json(
    { message: err instanceof Error ? err.message : "Internal Server Error" },
    (err as any)?.status || 500
  );
});

let adminCookie = "";
let testTypeId: number;

beforeAll(async () => {
  adminCookie = await adminLogin(app);
  // Insert a test budget code type
  const [inserted] = await db
    .insert(budgetCodeType)
    .values({ name: generateTestBudgetCodeTypeName() })
    .returning();
  testTypeId = inserted.id;
});

beforeEach(async () => {
  adminCookie = await adminLogin(app);
});

describe("Budget Code Type Routes", () => {
  describe("GET /budget-code-types", () => {
    test("returns 200 and a list of budget code types with pagination", async () => {
      const res = await app.request("/budget-code-types?page=1&limit=20", {
        method: "GET",
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("success", true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty("meta");
      expect(body.meta).toHaveProperty("page", 1);
      expect(body.meta).toHaveProperty("limit", 20);
      expect(body).toHaveProperty("message", "Fetched all Budget Code Types");
    });
  });

  describe("POST /budget-code-types", () => {
    test("creates a new budget code type", async () => {
      const newTypeName = generateTestBudgetCodeTypeName();
      const res = await app.request("/budget-code-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTypeName }),
      });
      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("data");
      expect(body.data).toMatchObject({ name: newTypeName });
    });

    test("returns 409 if a budget code type already exists", async () => {
      const dupName = generateTestBudgetCodeTypeName();
      // first creation
      await app.request("/budget-code-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: dupName }),
      });
      // duplicate
      const res = await app.request("/budget-code-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: dupName }),
      });
      expect(res.status).toBe(409);
      const body = await res.json();
      expect(body).toHaveProperty("message", "Budget Code Type already exists");
    });
  });

  describe("DELETE /budget-code-types/:id", () => {
    let createdId: number;
    beforeAll(async () => {
      const [inserted] = await db
        .insert(budgetCodeType)
        .values({ name: generateTestBudgetCodeTypeName() })
        .returning();
      createdId = inserted.id;
    });

    test("deletes a budget code type", async () => {
      const res = await app.request(`/budget-code-types/${createdId}`, {
        method: "DELETE",
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Deleted the Budget Code Type");
      expect(body).toHaveProperty("data");
    });

    test("returns 404 if budget code type not found", async () => {
      const res = await app.request("/budget-code-types/9999999", {
        method: "DELETE",
      });
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body).toHaveProperty("message", "Budget Code Type not found");
    });
  });

  describe("PATCH /budget-code-types/:id", () => {
    let createdId: number;
    beforeAll(async () => {
      const [inserted] = await db
        .insert(budgetCodeType)
        .values({ name: generateTestBudgetCodeTypeName() })
        .returning();
      createdId = inserted.id;
    });

    test("updates a budget code type", async () => {
      const newName = generateTestBudgetCodeTypeName();
      const res = await app.request(`/budget-code-types/${createdId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Budget Code Type updated successfully");
      expect(body.data).toMatchObject({ name: newName });
    });

    test("returns 404 if budget code type not found", async () => {
      const res = await app.request("/budget-code-types/9999999", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Whatever" }),
      });
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body).toHaveProperty("message", "Budget Code Type not found");
    });
  });
});

afterAll(async () => {
  await db
    .delete(budgetCodeType)
    .where(like(budgetCodeType.name, 'TEST_BUDGET_CODE_TYPE_%'))
    .execute();
  await (db.$client as any).end();
});
