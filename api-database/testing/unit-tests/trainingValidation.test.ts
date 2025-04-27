import { Hono } from 'hono';
import { trainingRoutes } from '../../api-files/routes/trainingValidation.js';
import { userRoutes } from '../../api-files/routes/users.js';
import { db } from '../../api-files/db/index.js';
import { users, machineTypes, userMachineType, machines } from '../../api-files/db/schema.js';
import { eq, like } from 'drizzle-orm';
import { Context } from '../../api-files/lib/context.js';
import { auth } from '../../api-files/middleware/auth.js';

// simulate login
async function adminLogin(app: Hono<Context>): Promise<string> {
  const adminCardNum = "1234567890777777";
  const response = await app.request(`/users/${adminCardNum}`);
  if (response.status !== 200) {
    throw new Error("Admin login failed");
  }
  const setCookie = response.headers.get("set-cookie") || "";
  return setCookie.split(";")[0];
}



// hono app setup
const app = new Hono<Context>();
app.use("/*", auth);
app.route('/', userRoutes);
app.route('/', trainingRoutes);

// error handler to handle errors form tests
app.onError((err, c) => {
  if (err instanceof Error && 'status' in err) {
    return c.json({ message: err.message }, (err as any).status || 400);
  }
  return c.json({ message: 'Internal Server Error' }, 500);
});

// Global variables for test data.
let testUserId: number;
let testMachineTypeId: number;
let testMachineId: number;
let adminCookie = "";

// Before all tests, log in as admin and insert test data.
beforeAll(async () => {
  adminCookie = await adminLogin(app);

  // Insert a test user.
  const [insertedUser] = await db
    .insert(users)
    .values({
      name: "Test Training User",
      cardNum: "999000000000002",
      lastDigitOfCardNum: 1,
      JHED: "trainuser",
      isAdmin: 0,
      graduationYear: 2025,
    })
    .returning();
  testUserId = insertedUser.id;

  // Insert a test machine type with a unique name to avoid duplicate errors.
  const uniqueTypeName = 'TEST_TRAINING_TYPE_' + Date.now();
  const [insertedType] = await db
    .insert(machineTypes)
    .values({ name: uniqueTypeName })
    .returning();
  testMachineTypeId = insertedType.id;

  // Insert a test machine.
  const [insertedMachine] = await db
    .insert(machines)
    .values({
      name: 'Test Machine',
      machineTypeId: testMachineTypeId,
      hourlyRate: 10, 
      active:1 
    })
    .returning();
  testMachineId = insertedMachine.id;
});

describe('Training Routes', () => {

  describe('GET /trainings/:userId/:machineId', () => {
    test('returns 200 when training relation exists (authorized user)', async () => {
      // Create a training relation so the user is authorized to use the machine.
      await db
        .insert(userMachineType)
        .values({ userId: testUserId, machineTypeId: testMachineTypeId })
        .returning();
      const url = `/trainings/${testUserId}/${testMachineId}`;
      const response = await app.request(url, { method: 'GET', headers: new Headers({ Cookie: adminCookie }) });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('message', 'Training validated');
    });

    test('returns 404 if user is not found', async () => {
      const url = `/trainings/999999/${testMachineId}`;
      const response = await app.request(url, { method: 'GET', headers: new Headers({ Cookie: adminCookie }) });
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toContain('User not found');
    });

    test('returns 404 if machine is not found', async () => {
      const url = `/trainings/${testUserId}/999999`;
      const response = await app.request(url, { method: 'GET', headers: new Headers({ Cookie: adminCookie }) });
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toContain('Machine not found.');
    });

    test('returns 401 if user is not authorized to use machine', async () => {
      // Remove any userMachineType relation for this user.
      await db.delete(userMachineType).where(eq(userMachineType.userId, testUserId)).execute();
      const url = `/trainings/${testUserId}/${testMachineId}`;
      const response = await app.request(url, { method: 'GET', headers: new Headers({ Cookie: adminCookie }) });
    
      expect(response.status).toBe(401);
      const text = await response.text();
      expect(text).toContain('User not authorized to use machine');
    });
  });

  describe('GET /trainings/:id', () => {
    test('fetches list of trainings for valid user with pagination', async () => {
      const url = `/trainings/${testUserId}?page=1&limit=20`;
      const response = await app.request(url, { method: 'GET', headers: new Headers({ Cookie: adminCookie }) });
      expect(response.status).toBe(200);
      const body = await response.json();
      // Ensure property name "success" is used.
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty('meta');
      expect(body.meta).toHaveProperty('page', 1);
      expect(body.meta).toHaveProperty('limit', 20);
      expect(body).toHaveProperty('message');
    });

    test('returns 404 when fetching trainings for non-existent user', async () => {
      const url = `/trainings/999999?page=1&limit=20`;
      const response = await app.request(url, { method: 'GET', headers: new Headers({ Cookie: adminCookie }) });
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toContain('User not found');
    });
  });

  describe('POST /trainings', () => {
    test('creates a training record and returns it (admin access)', async () => {
      const newTraining = { userId: testUserId, machineTypeId: testMachineTypeId };
      const response = await app.request('/trainings', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        }),
        body: JSON.stringify(newTraining),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      // If the returned data is an array, use the first element.
      const returned = Array.isArray(body.data) ? body.data[0] : body.data;
      expect(returned).toMatchObject(newTraining);
    });

    test('404 when user not found (admin access)', async () => {
      const newTraining = { userId: 9999999, machineTypeId: testMachineTypeId };
      const response = await app.request('/trainings', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        }),
        body: JSON.stringify(newTraining),
      });
      expect(response.status).toBe(404);
      const bodyResponse = await response.json();
      expect(bodyResponse).toHaveProperty('message', 'User not found');
    });
  });

  describe('DELETE /trainings', () => {
    test('deletes a training record and returns it (admin access)', async () => {
      // First, create a training record.
      const newTraining = { userId: testUserId, machineTypeId: testMachineTypeId };
      await app.request('/trainings', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json', Cookie: adminCookie }),
        body: JSON.stringify(newTraining),
      });
      // Then, delete the training record.
      const deleteResponse = await app.request('/trainings', {
        method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/json', Cookie: adminCookie }),
        body: JSON.stringify(newTraining),
      });
      expect(deleteResponse.status).toBe(200);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody).toHaveProperty('success', true);
      expect(deleteBody).toHaveProperty('message');
    });

    test('404 when user not found (admin access)', async () => {
      // First, create a training record.
      const fakeTraining = { userId: 9999999, machineTypeId: testMachineTypeId };
      
      // Then, delete the training record.
      const deleteResponse = await app.request('/trainings', {
        method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/json', Cookie: adminCookie }),
        body: JSON.stringify(fakeTraining),
      });
      expect(deleteResponse.status).toBe(404);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody).toHaveProperty('message', "User not found");
    });
  });


  describe('PATCH /trainings', () => {
    test('updates a training record and returns it (admin access)', async () => {
      // First, create a training record.
      const newTraining = { userId: testUserId, machineTypeId: testMachineTypeId };
      await app.request(`/trainings`, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json', Cookie: adminCookie }),
        body: JSON.stringify(newTraining),
      });
      // Then, update the training record.
      const updateResponse = await app.request(`/trainings/${testUserId}`, {
        method: 'PATCH',
        headers: new Headers({ 'Content-Type': 'application/json', Cookie: adminCookie }),
        body: JSON.stringify({"machine_types":[testMachineTypeId]}),
      });
      console.log(updateResponse);
      expect(updateResponse.status).toBe(200);
      const updateBody = await updateResponse.json();
      expect(updateBody).toHaveProperty('success', true);
      expect(updateBody).toHaveProperty('message', "Successfully replaced trainings of user.");
    });
  });

});

describe('Training Routes - Guard Errors', () => {
  test('returns 401 when no session is provided', async () => {
    const response = await app.request('/trainings/999999?page=1&limit=20', { method: 'GET' });

    expect(response.status).toBe(401);
    // const body = await response.json();
    const body = await response.json();
    expect(body).toHaveProperty('message', 'Unauthorized');
  });

  test('returns 403 when a non-admin session is used on admin-protected training routes', async () => {
    
      // non-admin login.
      const nonAdminLoginResponse = await app.request(`/users/1198347981913945`, {
        method: 'GET',
      });
      
      const nonAdminCookie = nonAdminLoginResponse.headers.get("set-cookie")?.split(";")[0] || "";
   
    const response = await app.request('/trainings', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Cookie: nonAdminCookie,
      }),
      body: JSON.stringify({ userId: testUserId, machineTypeId: testMachineTypeId }),
    });
    expect(response.status).toBe(403);
    const bodyResp = await response.json();
    expect(bodyResp).toHaveProperty('message', 'Forbidden: Admins only');
  });
});

//Clean up test data: Delete the test user, machine type, machine, and associated training relations.

afterAll(async () => {
  await db.delete(userMachineType).where(eq(userMachineType.userId, testUserId)).execute();
  await db.delete(users).where(eq(users.id, testUserId)).execute();
  await db.delete(machineTypes).where(eq(machineTypes.id, testMachineTypeId)).execute();
  await db.delete(machines).where(eq(machines.id, testMachineId)).execute();
  await (db.$client as any).end();
});
