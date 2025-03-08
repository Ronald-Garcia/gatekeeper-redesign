import { Hono } from 'hono';
import { machineRoutes } from '../../api-files/routes/machines.js';
import { db } from '../../api-files/db/index.js';
import { machines, machineTypes } from '../../api-files/db/schema.js';
import { like, eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

//Create a Hono instance and mount machine routes
const app = new Hono();
app.route('/', machineRoutes);

//error handler for json responses during error testing, necessary to make tests 
app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json({ message: err.message || 'Error' }, err.status);
    }
    return c.json({ message: err.message || 'Internal Server Error' }, 500);
  });

//generate machineNames for testing purposes, easier to clean after tests from the data base 
function generateTestMachineName(): string {
  return 'TEST_MACHINE_' + Math.floor(Math.random() * 1e8).toString().padStart(8, '0');
}


//Insert some test machine type so that machines can be created for testing to work properly
let testMachineTypeId: number;

beforeAll(async () => {
  
  const [inserted] = await db
    .insert(machineTypes)
    .values({ type: 'TEST_TYPE_' + Math.floor(Math.random() * 1e5).toString() })
    .returning();
  testMachineTypeId = inserted.id;
});

describe('Machine Routes', () => {
  describe('GET /machines/searchByName', () => {
    test('returns an array of machines with correct meta info', async () => {
      const response = await app.request('/machines/searchByName?page=1&limit=20');
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('sucess', true);
      expect(body).toHaveProperty('data');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty('meta');
      expect(body.meta).toHaveProperty('page', 1);
      expect(body.meta).toHaveProperty('limit', 20);
      expect(body).toHaveProperty('message');
    });
  });

  describe('POST /machines', () => {
    test('creates a machine and returns it on response', async () => {
      const newMachine = {
        name: generateTestMachineName(),
        machineTypeId: testMachineTypeId, 
        hourlyRate: 25.0,
      };

      const response = await app.request('/machines', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newMachine),
      });
      // Expect 201 Created
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('sucess', true);
      expect(body).toHaveProperty('data');
      // Adjust based on return structure:
      const returned = body.data[0] || body.data;
      expect(returned).toMatchObject(newMachine);
    });
  });

  describe('DELETE /machines/:id', () => {
    test('deletes a machine if it exists', async () => {
      const newMachine = {
        name: generateTestMachineName(),
        machineTypeId: testMachineTypeId,
        hourlyRate: 30.0,
      };

      const postResponse = await app.request('/machines', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newMachine),
      });
      const postBody = await postResponse.json();
      const machineId = postBody.data[0]?.id || postBody.data.id;
      expect(machineId).toBeDefined();

      const deleteResponse = await app.request(`/machines/${machineId}`, {
        method: 'DELETE',
      });
      expect(deleteResponse.status).toBe(200);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody).toHaveProperty('sucess', true);
      expect(deleteBody).toHaveProperty('message');
    });

    test('returns 404 when trying to delete a non-existent machine', async () => {
      const response = await app.request('/machines/9999999', { method: 'DELETE' });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty('message');
    });
  });
});

//clean up database after testing 
afterAll(async () => {
  await db
    .delete(machines)
    .where(like(machines.name, 'TEST_MACHINE_%'))
    .execute();
  await db
    .delete(machineTypes)
    .where(eq(machineTypes.id, testMachineTypeId))
    .execute();
  
});
