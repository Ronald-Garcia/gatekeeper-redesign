import { Hono } from 'hono';
import { machineTypeRoutes } from '../../api-files/routes/machineTypes.js';
import { userRoutes } from '../../api-files/routes/users.js';
import { db } from '../../api-files/db/index.js';
import { machineTypes } from '../../api-files/db/schema.js';
import { eq, like } from 'drizzle-orm';
import { Context } from '../../api-files/lib/context.js';
import { auth } from '../../api-files/middleware/auth.js';
import { HTTPException } from 'hono/http-exception';

//Helper to simulate an admin login using the test admin card number.
async function adminLogin(app: Hono<Context>): Promise<string> {
  const adminCardNum = "1234567890777777";
  const response = await app.request(`/users/${adminCardNum}`);
  if (response.status !== 200) {
    throw new HTTPException(407, { message: "Admin login failed" });
  }
  const setCookie = response.headers.get("set-cookie") || "";
  return setCookie.split(";")[0];
}

/* 
  Helper to generate a unique machine type name.
*/
function generateTestMachineTypeName(): string {
  return "TEST_MACHINE_TYPE_" + Math.floor(Math.random() * 1e8).toString().padStart(8, "0");
}

// Create a new Hono instance and mount both the user and machine type routes.
//Mounting userRoutes makes the admin login endpoint available.
const app = new Hono<Context>();
app.use("/*", auth);
app.route("/", userRoutes);
app.route("/", machineTypeRoutes);

// error handler to get error jsons
app.onError((err, c) => {
  return c.json(
    { message: err instanceof Error ? err.message : "Internal Server Error" },
    (err as any)?.status || 400
  );
});

//Global variable to hold test machine type ID.
let testMachineTypeId: number;
let adminCookie = "";
const invalidMachineTypeId = 999999; // An invalid machine type id

// Before all tests, log in as admin and insert test data.
beforeAll(async () => {
  adminCookie = await adminLogin(app);
  // Insert a test machine type.
  const [insertedType] = await db
    .insert(machineTypes)
    .values({ name: generateTestMachineTypeName() })
    .returning();
  testMachineTypeId = insertedType.id;
});

// refresh cookie just in case
beforeEach(async () => {
  adminCookie = await adminLogin(app);
});

describe("Machine Type Routes", () => {
  describe("GET /machine-types", () => {
    test("returns 200 and a list of machine types with pagination", async () => {
      const response = await app.request("/machine-types?page=1&limit=20", {
        headers: { },
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("data");
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty("meta");
      expect(body.meta).toHaveProperty("page", 1);
      expect(body.meta).toHaveProperty("limit", 20);
      expect(body).toHaveProperty("message", "Fetched all Types");
    });
  });

  describe("POST /machine-types", () => {
    test("creates a new machine type and returns it (admin access)", async () => {
      const newType = { name: generateTestMachineTypeName() };
      const response = await app.request("/machine-types", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(newType),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("data");
      const returned = Array.isArray(body.data) ? body.data[0] : body.data;
      expect(returned).toMatchObject(newType);
    });

    test("returns 409 if machine type already exists", async () => {
      const typeName = generateTestMachineTypeName();
      const newType = { name: typeName };
      // First creation should succeed.
      await app.request("/machine-types", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(newType),
      });
      //Second creation with the same name should fail.
      const response = await app.request("/machine-types", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(newType),
      });
      expect(response.status).toBe(409);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Machine Type already exists");
    });
  });

  describe("DELETE /machine-types/:id", () => {
    let createdTypeId: number;
    beforeAll(async () => {
      //Create a machine type to delete.
      const newType = { name: generateTestMachineTypeName() };
      const response = await app.request("/machine-types", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(newType),
      });
      const body = await response.json();
      createdTypeId = Array.isArray(body.data) ? body.data[0].id : body.data.id;
    });

    test("deletes a machine type and returns it (admin access)", async () => {
      const response = await app.request(`/machine-types/${createdTypeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Deleted a machine type");
      expect(body).toHaveProperty("data");
    });

    test("returns 404 when trying to delete a non-existent machine type", async () => {
      const response = await app.request("/machine-types/999999", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
      });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Machine Type not found");
    });
  });

  describe("PATCH /machine-types/:id", () => {
    let createdTypeId: number;
    beforeAll(async () => {
      // Create a machine type to update.
      const newType = { name: generateTestMachineTypeName() };
      const response = await app.request("/machine-types", {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(newType),
      });
      const body = await response.json();
      createdTypeId = Array.isArray(body.data) ? body.data[0].id : body.data.id;
    });

    test("updates a machine type and returns it (admin access)", async () => {
      const updateData = { name: generateTestMachineTypeName() };
      const response = await app.request(`/machine-types/${createdTypeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(updateData),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("message", "Machine type updated successfully");
      expect(body).toHaveProperty("data");
      const returned = Array.isArray(body.data) ? body.data[0] : body.data;
      expect(returned).toMatchObject(updateData);
    });

    test("returns 404 when updating a non-existent machine type", async () => {
      const updateData = { name: generateTestMachineTypeName() };
      const response = await app.request("/machine-types/999999", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: adminCookie },
        body: JSON.stringify(updateData),
      });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty("message", "Machine Type not found");
    });
  });
});

// delete test data
afterAll(async () => {
  await db.delete(machineTypes).where(like(machineTypes.name, "TEST_MACHINE_TYPE_%")).execute();
  await (db.$client as any).end();
});
