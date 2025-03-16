import { Hono } from 'hono';
import { trainingRoutes } from '../../api-files/routes/trainingValidation.js';
import { userRoutes } from '../../api-files/routes/users.js';
import { db } from '../../api-files/db/index.js';
import { users, machineTypes, userMachineType, machines } from '../../api-files/db/schema.js';
import { eq, like } from 'drizzle-orm';
import { Context } from '../../api-files/lib/context.js';
import { auth } from '../../api-files/middleware/auth.js';

/* 
  Helper to simulate an admin login using the test admin card number.
  We assume that GET /users/:cardNum (without an admin guard) creates a session and sets a cookie.
*/
async function adminLogin(app: Hono<Context>): Promise<string> {
  const adminCardNum = "1234567890777777";
  const response = await app.request(`/users/${adminCardNum}`);
  if (response.status !== 200) {
    throw new Error("Admin login failed");
  }
  const setCookie = response.headers.get("set-cookie") || "";
  return setCookie.split(";")[0];
}

/* 
  Helper to generate a unique 15-digit card number for tests that always starts with "999"
  (999 + 12 random digits, makes it easier to clean up test data)
*/
function generateTestCardNumber(): string {
  const randomPart = Math.floor(Math.random() * 1e13).toString().padStart(13, '0');
  return "999" + randomPart;
}

/* 
  Create a new Hono instance and mount both the user and training routes.
  Mounting userRoutes makes the admin login endpoint available.
*/
const app = new Hono<Context>();
app.use("/*", auth);
app.route('/', userRoutes);
app.route('/', trainingRoutes);

/* 
  Add an error handler so that errors are returned as JSON,
  which is required for testing.
*/
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
      cardNum: "999000000000001",
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
      hourlyRate: 10
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
      console.log("this", response);
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
  });
});

describe('Training Routes - Guard Errors', () => {
  test('returns 401 when no session is provided', async () => {
    const response = await app.request('/trainings/999999?page=1&limit=20', { method: 'GET' });
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('message', 'Unauthorized');
  });

  test('returns 403 when a non-admin session is used on admin-protected training routes', async () => {
    // Create a non-admin user and simulate its login.
    const testCardNum = generateTestCardNumber();
    const nonAdminUser = {
      name: "Non Admin",
      cardNum: testCardNum,
      JHED: "nonadmin",
      isAdmin: 0,
      graduationYear: 2025,
    };
    // Create non-admin user using admin access.
    await app.request('/users', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json', Cookie: adminCookie }),
      body: JSON.stringify(nonAdminUser),
    });
    // Simulate non-admin login.
    const nonAdminLoginResponse = await app.request(`/users/${nonAdminUser.cardNum}`, {
      headers: new Headers({ Cookie: adminCookie })
    });
    const nonAdminCookie = nonAdminLoginResponse.headers.get("set-cookie")?.split(";")[0] || "";
    // Attempt to access an admin-protected training route.
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
