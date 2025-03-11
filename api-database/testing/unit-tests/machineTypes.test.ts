import { Hono } from 'hono';
import { machineTypeRoutes } from '../../api-files/routes/machineTypes.js';
import { db } from '../../api-files/db/index.js';
import { machineTypes } from '../../api-files/db/schema.js';
import { eq, asc, desc, ilike, and } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

//Create a Hono instance and mount machine type routes.
const app = new Hono();
app.route('/', machineTypeRoutes);

//error handler
app.onError((err, c) => {
  if (typeof (err as any).getResponse === 'function') {
    return (err as any).getResponse();
  }
  return c.json({ message: err.message || 'Internal Server Error' }, 500);
});

let testMachineTypeId: number;
let updateTestType: string;

describe('MachineType Routes', () => {
  describe('GET /machine-types', () => {
    test("returns an array of machineTypes with correct meta info", async () => {
      const response = await app.request('/machine-types?page=1&limit=20');
      expect(response.status).toBe(200);
      const body = await response.json();
      // sucess is mispelled :(
      expect(body).toHaveProperty('sucess', true);
      expect(body).toHaveProperty('data');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty('meta');
      expect(body.meta).toHaveProperty('page', 1);
      expect(body.meta).toHaveProperty('limit', 20);
      expect(body).toHaveProperty('message');
    });
  });

  describe('POST /machine-types', () => {
    test("creates a new machine type", async () => {
      const newType = { machineType: "TEST_NEW_TYPE" };
      const response = await app.request('/machine-types', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newType),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('sucess', true);
      expect(body).toHaveProperty('message', "Created a new machine type");
      expect(body).toHaveProperty('data');
      //Store the new machine type ID for later deletion/updating.
      testMachineTypeId = body.data.id;
    });

    test("returns 409 if machine type already exists", async () => {
      const duplicateType = { machineType: "TEST_NEW_TYPE" };
      const response = await app.request('/machine-types', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(duplicateType),
      });
      expect(response.status).toBe(409);
      // Use text() because the error response is not valid JSON
      const text = await response.text();
      expect(text).toContain("Machine Type already exists");
    });
  });

  describe('DELETE /machine-types/:machineTypeId', () => {
    test("deletes an existing machine type", async () => {
      const response = await app.request(`/machine-types/${testMachineTypeId}`, {
        method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('sucess', true);
      expect(body).toHaveProperty('message', "Deleted a machine type");
      expect(body).toHaveProperty('data');
    });

    test("returns 404 when deleting a non-existent machine type", async () => {
      const response = await app.request(`/machine-types/999999`, {
        method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toContain("Machine Type not found");
    });
  });

  describe('PATCH /machine-types/:machineType', () => {
    beforeAll(async () => {
      //Insert a machine type for updating.
      const [inserted] = await db
        .insert(machineTypes)
        .values({ type: "TEST_UPDATE_TYPE" })
        .returning();
      updateTestType = inserted.type;
    });
  
    test("updates an existing machine type", async () => {
      const uniqueValue = `TEST_UPDATED_TYPE_${Date.now()}`;
      const updatePayload = { updateType: uniqueValue };
      const response = await app.request(`/machine-types/${updateTestType}`, {
        method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updatePayload),
      });
      if (response.status !== 200) {
        const errText = await response.text();
        throw new Error(`Expected status 200 but received ${response.status}. Error: ${errText}`);
      }
      expect(response.status).toBe(200);
      const body = await response.json();
      //assert properties
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('message', "Deck updated successfully");
      expect(body).toHaveProperty('data');
      expect(body.data[0].type).toEqual(uniqueValue);
    });
  

    test("returns 404 when updating a non-existent machine type", async () => {
      const updatePayload = { updateType: "DOES_NOT_EXIST" };
      const response = await app.request(`/machine-types/NON_EXISTENT_TYPE`, {
        method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updatePayload),
      });
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toContain("Machine Type not found");
    });
  });
});

//Remove any test machine types inserted.
afterAll(async () => {
  if (testMachineTypeId) {
    await db
      .delete(machineTypes)
      .where(eq(machineTypes.id, testMachineTypeId))
      .execute();
  }
  // Delete the machine type inserted for the PATCH tests.
  await db
    .delete(machineTypes)
    .where(ilike(machineTypes.type, 'TEST_UPDATE_TYPE'))
    .execute();
  await (db.$client as any).end();
});