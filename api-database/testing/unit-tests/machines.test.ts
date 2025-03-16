import { Hono } from 'hono';
import { machineRoutes } from '../../api-files/routes/machines.js';
import { userRoutes } from '../../api-files/routes/users.js';
import { db } from '../../api-files/db/index.js';
import { machines, machineTypes } from '../../api-files/db/schema.js';
import { eq, like } from 'drizzle-orm';
import { Context } from '../../api-files/lib/context.js';
import { auth } from '../../api-files/middleware/auth.js';
import { ZodError } from 'zod';
import { HTTPException } from 'hono/http-exception';

// Log in as admin via GET /users/:cardNum
async function adminLogin(app: Hono<Context>): Promise<string> {
  const adminCardNum = "1234567890777777";
  const response = await app.request(`/users/${adminCardNum}`);
 
  const setCookie = response.headers.get("set-cookie") || "";
  //get cookie
  return setCookie.split(";")[0];
}

// Log in as a user (non‑admin) via GET /users/:cardNum
async function userLogin(app: Hono<Context>, cardNum: string): Promise<string> {
  const response = await app.request(`/users/${cardNum}`);
  const setCookie = response.headers.get("set-cookie") || "";
  return setCookie.split(";")[0];
}

// Generate a unique 15‑digit card number that starts with "999"
function generateTestCardNumber(): string {
  const randomPart = Math.floor(Math.random() * 1e13)
    .toString()
    .padStart(13, '0');
  return "999" + randomPart;
}

// Generate a unique machine name
function generateTestMachineName(): string {
  return "TEST_MACHINE_" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
}

// app setup 
const app = new Hono<Context>();
// Attach auth middleware so that Lucia sets the session/user from the Cookie header.
app.use("/*", auth);
app.route("/", userRoutes);
app.route("/", machineRoutes);

// Error handler so that errors are returned as JSON.
app.onError((err, c) => {
  if (err instanceof Error && "status" in err) {
    return c.json({ message: err.message }, (err as any).status || 400);
  }
  return c.json({ message: "Internal Server Error" }, 500);
});

// global vars for tests
let testMachineTypeId: number;
let testMachineId: number;
let testMachineName: string;
let adminCookie = "";
const invalidMachineTypeId = 999999; // A machine type that does not exist

// Before all tests, log in as admin and insert test data.
beforeAll(async () => {
  adminCookie = await adminLogin(app);

  // Insert a test machine type.
  const [insertedType] = await db
    .insert(machineTypes)
    .values({ name: "TEST_MACHINE_TYPE" })
    .returning();
  testMachineTypeId = insertedType.id;

  // Insert a test machine.
  testMachineName = generateTestMachineName();
  const [insertedMachine] = await db
    .insert(machines)
    .values({
      name: testMachineName,
      machineTypeId: testMachineTypeId,
      hourlyRate: 10,
    })
    .returning();
  testMachineId = insertedMachine.id;
});

// Refresh admin login before each admin‑protected test.
beforeEach(async () => {
  adminCookie = await adminLogin(app);
});

// tests, please work 
describe("Machine Routes", () => {

  describe("GET /machines", () => {
    test("returns 200 and machine list with valid non‑admin session", async () => {
      // Create a non‑admin user and immediately log in as that user.
      const testNonAdminCard = generateTestCardNumber();
      // Create the non‑admin user using the admin endpoint.
      await app.request("/users", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: adminCookie,
        }),
        body: JSON.stringify({
          name: "NonAdmin",
          cardNum: testNonAdminCard,
          JHED: "nonad",
          isAdmin: 0,
          graduationYear: 2025,
        }),
      });
      const nonAdminCookieLocal = await userLogin(app, testNonAdminCard);

      const response = await app.request("/machines?page=1&limit=20", {
        headers: new Headers({ Cookie: nonAdminCookieLocal }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      // Adjust property name if needed (e.g., "success" vs. "success")
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("data");
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty("meta");
      expect(body.meta).toHaveProperty("page", 1);
      expect(body.meta).toHaveProperty("limit", 20);
      expect(body).toHaveProperty("message", "Fetched machines");
    });

    test("returns 401 Unauthorized when no session is provided", async () => {
      const response = await app.request("/machines?page=1&limit=20");
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("GET /machines/:id", () => {
    test("returns 200 and the machine when found with valid session", async () => {
      const response = await app.request(`/machines/${testMachineId}`, {
        headers: new Headers({ Cookie: adminCookie }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Machine found!");
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id", testMachineId);
    });

    test("returns 404 when machine is not found", async () => {
      const response = await app.request("/machines/9999999", {
        headers: new Headers({ Cookie: adminCookie }),
      });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Machine not found!");
    });

    test("returns 401 Unauthorized when no session is provided", async () => {
      const response = await app.request(`/machines/${testMachineId}`);
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("POST /machines", () => {
    test("creates a machine and returns it with admin access", async () => {
      // Define newMachineData inside the test so that testMachineTypeId is available
      const newMachineData = {
        name: generateTestMachineName(),
        machineTypeId: testMachineTypeId,
        hourlyRate: 25,
      };

      const response = await app.request("/machines", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: adminCookie,
        }),
        body: JSON.stringify(newMachineData),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("data");
      const returned = body.data;
      expect(returned).toMatchObject(newMachineData);
    });

    test("returns 401 Unauthorized when no session is provided", async () => {
      const newMachineData = {
        name: generateTestMachineName(),
        machineTypeId: testMachineTypeId,
        hourlyRate: 25,
      };
      const response = await app.request("/machines", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(newMachineData),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });

    test("returns 403 Forbidden when a non‑admin session is used", async () => {
      const newMachineData = {
        name: generateTestMachineName(),
        machineTypeId: testMachineTypeId,
        hourlyRate: 25,
      };
      // Create and log in as a non‑admin user for this test.
      const testNonAdminCard = generateTestCardNumber();
      await app.request("/users", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: adminCookie,
        }),
        body: JSON.stringify({
          name: "NonAdmin",
          cardNum: testNonAdminCard,
          JHED: "nonad",
          isAdmin: 0,
          graduationYear: 2025,
        }),
      });
      const nonAdminCookieLocal = await userLogin(app, testNonAdminCard);
      const response = await app.request("/machines", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: nonAdminCookieLocal,
        }),
        body: JSON.stringify(newMachineData),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Forbidden: Admins only");
    });

    test("returns 404 if machine type is invalid", async () => {
      const newMachineData = {
        name: generateTestMachineName(),
        machineTypeId: testMachineTypeId,
        hourlyRate: 25,
      };
      const invalidData = { ...newMachineData, machineTypeId: invalidMachineTypeId };
      const response = await app.request("/machines", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: adminCookie,
        }),
        body: JSON.stringify(invalidData),
      });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Invalid machine type");
    });
  });

  describe("PATCH /machines/:id", () => {
    let createdMachineId: number;

    beforeAll(async () => {
      // Create a machine to update.
      const response = await app.request("/machines", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: adminCookie,
        }),
        body: JSON.stringify({
          name: generateTestMachineName(),
          machineTypeId: testMachineTypeId,
          hourlyRate: 30.0,
        }),
      });
      const body = await response.json();
      createdMachineId = body.data.id || body.data[0].id;
    });

    test("updates a machine and returns it with admin access", async () => {
      // Define updateData inside the test so that testMachineTypeId is defined
      const updateData = {
        name: generateTestMachineName(),
        machineTypeId: testMachineTypeId,
        hourlyRate: 35,
      };
      const response = await app.request(`/machines/${createdMachineId}`, {
        method: "PATCH",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: adminCookie,
        }),
        body: JSON.stringify(updateData),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("data");
      const returned = Array.isArray(body.data) ? body.data[0] : body.data;
      expect(returned).toMatchObject(updateData);
    });

    test("returns 404 when updating a non-existent machine", async () => {
      const updateData = {
        name: generateTestMachineName(),
        machineTypeId: testMachineTypeId,
        hourlyRate: 35,
      };
      const response = await app.request("/machines/9999999", {
        method: "PATCH",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: adminCookie,
        }),
        body: JSON.stringify(updateData),
      });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Machine not found");
    });

    test("returns 401 Unauthorized when no session is provided", async () => {
      const updateData = {
        name: generateTestMachineName(),
        machineTypeId: testMachineTypeId,
        hourlyRate: 35,
      };
      const response = await app.request(`/machines/${createdMachineId}`, {
        method: "PATCH",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify(updateData),
      });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });

    test("returns 403 Forbidden when a non‑admin session is used", async () => {
      const updateData = {
        name: generateTestMachineName(),
        machineTypeId: testMachineTypeId,
        hourlyRate: 35,
      };
      // Create and log in as a non‑admin for this test.
      const testNonAdminCard = generateTestCardNumber();
      await app.request("/users", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: adminCookie,
        }),
        body: JSON.stringify({
          name: "NonAdmin",
          cardNum: testNonAdminCard,
          JHED: "nonad",
          isAdmin: 0,
          graduationYear: 2025,
        }),
      });
      const nonAdminCookieLocal = await userLogin(app, testNonAdminCard);
      const response = await app.request(`/machines/${createdMachineId}`, {
        method: "PATCH",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: nonAdminCookieLocal,
        }),
        body: JSON.stringify(updateData),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Forbidden: Admins only");
    });

    test("returns 404 if new machine type is invalid", async () => {
      const updateData = {
        name: generateTestMachineName(),
        machineTypeId: invalidMachineTypeId,
        hourlyRate: 35,
      };
      const response = await app.request(`/machines/${createdMachineId}`, {
        method: "PATCH",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: adminCookie,
        }),
        body: JSON.stringify(updateData),
      });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Invalid machine type");
    });
  });

  describe("DELETE /machines/:id", () => {
    let createdMachineId: number;
    beforeAll(async () => {
      // Create a machine to delete.
      const response = await app.request("/machines", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: adminCookie,
        }),
        body: JSON.stringify({
          name: generateTestMachineName(),
          machineTypeId: testMachineTypeId,
          hourlyRate: 30.0,
        }),
      });
      const body = await response.json();
      createdMachineId = body.data.id || body.data[0].id;
    });

    test("deletes a machine and returns it with admin access", async () => {
      const response = await app.request(`/machines/${createdMachineId}`, {
        method: "DELETE",
        headers: new Headers({ Cookie: adminCookie }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Deleted a machine");
    });

    test("returns 404 when trying to delete a non-existent machine", async () => {
      const response = await app.request("/machines/9999999", {
        method: "DELETE",
        headers: new Headers({ Cookie: adminCookie }),
      });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty("message");
    });

    test("returns 401 Unauthorized when no session is provided", async () => {
      const response = await app.request(`/machines/${createdMachineId}`, { method: "DELETE" });
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Unauthorized");
    });

    test("returns 403 Forbidden when a non‑admin session is used", async () => {
      const testNonAdminCard = generateTestCardNumber();
      await app.request("/users", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Cookie: adminCookie,
        }),
        body: JSON.stringify({
          name: "NonAdmin",
          cardNum: testNonAdminCard,
          JHED: "nonad",
          isAdmin: 0,
          graduationYear: 2025,
        }),
      });
      const nonAdminCookieLocal = await userLogin(app, testNonAdminCard);
      const response = await app.request(`/machines/${createdMachineId}`, {
        method: "DELETE",
        headers: new Headers({ Cookie: nonAdminCookieLocal }),
      });
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Forbidden: Admins only");
    });
  });
});

// CLEANUP
afterAll(async () => {
  await db.delete(machines).where(like(machines.name, "TEST_MACHINE_%")).execute();
  await db.delete(machineTypes).where(eq(machineTypes.id, testMachineTypeId)).execute();
  await (db.$client as any).end();
});
