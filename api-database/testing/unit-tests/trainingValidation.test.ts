// file: testing/unit-tests/trainingValidation.test.ts
import { Hono } from 'hono';
import { trainingRoutes } from '../../api-files/routes/trainingValidation.js';
import { db } from '../../api-files/db/index.js';
import { users, machineTypes, userMachineType } from '../../api-files/db/schema.js';
import { eq } from 'drizzle-orm';

// Create a Hono instance and mount training routes
const app = new Hono();
app.route('/', trainingRoutes);

// Global error handler to return JSON responses
app.onError((err, c) => {
  if (typeof (err as any).getResponse === 'function') {
    return (err as any).getResponse();
  }
  return c.json({ message: err.message || 'Internal Server Error' }, 500);
});

let testUserId: number;
let testMachineTypeId: number;

beforeAll(async () => {
  // Insert a test user.
  const [insertedUser] = await db
    .insert(users)
    .values({
      name: "Test Training User",
      cardNum: "999000000000001", // unique test value
      lastDigitOfCardNum: 1,
      JHED: "trainuser",
      isAdmin: 0,
      graduationYear: 2025,
    })
    .returning();
  testUserId = insertedUser.id;

  //Insert a test machine type
  const [insertedType] = await db
    .insert(machineTypes)
    .values({ type: 'TEST_TRAINING_TYPE' })
    .returning();
  testMachineTypeId = insertedType.id;
});

describe('Training Routes', () => {
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
      //Expect 201 Created
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('sucess', true);
      expect(body).toHaveProperty('data');
      //Adjust based on return structure:
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

      // Now, delete the training record using the same details.
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

//Cleanup: delete test training records, the test user, and the test machine type.
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
});
