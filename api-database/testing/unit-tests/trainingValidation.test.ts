import { Hono } from 'hono';
import { trainingRoutes } from '../../api-files/routes/trainingValidation.js';
import { db } from '../../api-files/db/index.js';
import { users, machineTypes, userMachineType, machines } from '../../api-files/db/schema.js';
import { eq } from 'drizzle-orm';

//Create a Hono instance and mount training routes.
const app = new Hono();
app.route('/', trainingRoutes);

//Error handler to return JSON responses
app.onError((err, c) => {
  if (typeof (err as any).getResponse === 'function') {
    return (err as any).getResponse();
  }
  return c.json({ message: err.message || 'Internal Server Error' }, 500);
});

let testUserId: number;
let testMachineTypeId: number;
let testMachineId: number;

beforeAll(async () => {
  // Insert a test user.
  const [insertedUser] = await db
    .insert(users)
    .values({
      name: "Test Training User",
      cardNum: "999000000000001", 
      lastDigitOfCardNum: 1,
      JHED: "trainuser",
      isAdmin: 0,
      graduationYear: 2025,
    })
    .returning();
  testUserId = insertedUser.id;

  // Insert a test machine type.
  const [insertedType] = await db
    .insert(machineTypes)
    .values({ name: 'TEST_TRAINING_TYPE' })
    .returning();
  testMachineTypeId = insertedType.id;

  // nsert a test machine using the machine type.
  const [insertedMachine] = await db
    .insert(machines)
    .values({ 
      name: 'Test Machine',
      machineTypeId: testMachineTypeId,
      hourlyRate: 10
    })
    .returning();
  testMachineId = insertedMachine.id;
});

describe('Training Routes', () => {
  describe('GET /trainings/:userId/:machineId', () => {
    test('returns 501 when session creation is not implemented', async () => {
      const url = `/trainings/${testUserId}/${testMachineId}`;
      const response = await app.request(url, { method: 'GET' });
      expect(response.status).toBe(501);
      const text = await response.text();
      expect(text).toContain('Have not implemented sessions for users yet.');
    });

    test('returns 404 if user is not found', async () => {
      const url = `/trainings/999999/${testMachineId}`;
      const response = await app.request(url, { method: 'GET' });
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toContain('User not found');
    });

    test('returns 404 if machine is not found', async () => {
      const url = `/trainings/${testUserId}/999999`;
      const response = await app.request(url, { method: 'GET' });
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toContain('Machine not found.');
    });
  });

  describe('GET /trainings/:id', () => {
    test('fetches list of trainings for valid user with pagination', async () => {
      const url = `/trainings/${testUserId}?page=1&limit=20`;
      const response = await app.request(url, { method: 'GET' });
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

    test('returns 404 when fetching trainings for non-existent user', async () => {
      const url = `/trainings/999999?page=1&limit=20`;
      const response = await app.request(url, { method: 'GET' });
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toContain('User not found');
    });
  });

  describe('POST /trainings', () => {
    test('creates a training record and returns it', async () => {
      const newTraining = {
        userId: testUserId,
        machineTypeId: testMachineTypeId,
      };

      const response = await app.request('/trainings', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newTraining),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('sucess', true);
      expect(body).toHaveProperty('data');
      const returned = body.data[0] || body.data;
      expect(returned).toMatchObject(newTraining);
    });
  });

  describe('DELETE /trainings', () => {
    test('deletes a training record and returns it', async () => {
      //First, create a training record to delete.
      const newTraining = {
        userId: testUserId,
        machineTypeId: testMachineTypeId,
      };

      await app.request('/trainings', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newTraining),
      });

      //Now delete the training record using the same details.
      const deleteResponse = await app.request('/trainings', {
        method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newTraining),
      });
      expect(deleteResponse.status).toBe(200);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody).toHaveProperty('sucess', true);
      expect(deleteBody).toHaveProperty('message');
    });
  });
});

//Delete test training records, the test user, machine type, and machine.
afterAll(async () => {
  await db
    .delete(userMachineType)
    .where(eq(userMachineType.userId, testUserId))
    .execute();
  await db
    .delete(users)
    .where(eq(users.id, testUserId))
    .execute();
  await db
    .delete(machineTypes)
    .where(eq(machineTypes.id, testMachineTypeId))
    .execute();
  await db
    .delete(machines)
    .where(eq(machines.id, testMachineId))
    .execute();
  await (db.$client as any).end();
});
