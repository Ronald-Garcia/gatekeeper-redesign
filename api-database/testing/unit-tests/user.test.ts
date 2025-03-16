import { Hono } from 'hono';
import { userRoutes } from '../../api-files/routes/users.js';
import { db } from '../../api-files/db/index.js';
import { users } from '../../api-files/db/schema.js';
import { like } from 'drizzle-orm';
import { Context } from '../../api-files/lib/context.js';
import { auth } from '../../api-files/middleware/auth.js';

// helper function to login as admin for tests 
async function adminLogin(app: Hono<Context>): Promise<string> {
  const adminCardNum = "1234567890777777";
  const response = await app.request(`/users/${adminCardNum}`);
  if (response.status !== 200) {
    throw new Error("Admin login failed");
  }
  const setCookie = response.headers.get("set-cookie") || "";
  //get cookie
  return setCookie.split(";")[0];
}

// Helper to generate a unique 15-digit card number for tests that always starts with "999"
function generateTestCardNumber(): string {
  const randomPart = Math.floor(Math.random() * 1e13)
    .toString()
    .padStart(13, '0');
  return "999" + randomPart;
}

//Create a new Hono instance and mount the user routes.
const app = new Hono<Context>();
app.use("/*", auth);
app.route('/', userRoutes);

/* 
  Add an error handler so that errors are returned as JSON, 
  will not work without this.
*/
app.onError((err, c) => {
  if (err instanceof Error && 'status' in err) {
    return c.json({ message: err.message }, (err as any).status || 400);
  }
  return c.json({ message: 'Internal Server Error' }, 500);
});

// variable to hold adminCookie
let adminCookie = "";

beforeAll(async () => {
  // Log in as admin
  adminCookie = await adminLogin(app);
});

/* 
 User Route tests
*/
describe('User Routes (with auth/admin guard enabled)', () => {

  /* 
    Tests for GET /users route.
  */
  describe('GET /users', () => {
    test('returns an array of users with correct meta info (admin access)', async () => {
      const response = await app.request('/users?page=1&limit=20', {
        headers: new Headers({ Cookie: adminCookie }),
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty('meta');
      expect(body.meta).toHaveProperty('page', 1);
      expect(body.meta).toHaveProperty('limit', 20);
      expect(body).toHaveProperty('message', 'Fetched user routes');
    });
  });

  /* 
    Tests for POST /users route.
  */
  describe('POST /users', () => {
    test('creates a user and returns it in the response (admin access)', async () => {
      const testCardNum = generateTestCardNumber();
      const newUser = {
        name: "Ronald Cameron",
        cardNum: testCardNum,
        JHED: "roncam",
        isAdmin: 1,
        graduationYear: 2024,
      };

      const expectedUser = {
        name: "Ronald Cameron",
        cardNum: testCardNum.substring(0, testCardNum.length - 1),
        lastDigitOfCardNum: Number.parseInt(testCardNum.charAt(testCardNum.length - 1)),
        JHED: "roncam",
        isAdmin: 1,
        graduationYear: 2024,
        active: 1
      };

      const response = await app.request('/users', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        }),
        body: JSON.stringify(newUser),
      });
      expect(response.status).toBe(201);
      const bodyResponse = await response.json();
      expect(bodyResponse).toHaveProperty('success', true);
      expect(bodyResponse).toHaveProperty('data');
      // The route returns an object (not an array) for POST.
      expect(bodyResponse.data).toMatchObject(expectedUser);
    });

    test('returns 409 when a user with the same card number already exists (admin access)', async () => {
      // Use a fixed test card number for this duplicate test.
      const duplicateCardNum = generateTestCardNumber();
      const duplicateUser = {
        name: "Test User",
        cardNum: duplicateCardNum,
        JHED: "testuser",
        isAdmin: 0,
        graduationYear: 2024,
      };

      // First creation should succeed.
      await app.request('/users', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        }),
        body: JSON.stringify(duplicateUser),
      });

      // Create duplicate user
      const response = await app.request('/users', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        }),
        body: JSON.stringify(duplicateUser),
      });
      expect(response.status).toBe(409);
      const bodyResponse = await response.json();
      expect(bodyResponse).toHaveProperty('message', 'User with this card number already exists.');
    });
  });

  /* 
    Tests for GET /users/:cardNum route.
  */
  describe('GET /users/:cardNum', () => {
    test('returns a user if one exists (admin access)', async () => {
      const testCardNum = generateTestCardNumber();
      const newUser = {
        name: "John Doe",
        cardNum: testCardNum,
        JHED: "johndoe",
        isAdmin: 0,
        graduationYear: 2023,
      };

      const expectedUser = {
        name: "John Doe",
        cardNum: testCardNum.substring(0, testCardNum.length - 1),
        lastDigitOfCardNum: Number.parseInt(testCardNum.charAt(testCardNum.length - 1)),
        JHED: "johndoe",
        isAdmin: 0,
        graduationYear: 2023,
      };

      // Create the user first.
      await app.request('/users', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        }),
        body: JSON.stringify(newUser),
      });

      // Get user by card number.
      const response = await app.request(`/users/${newUser.cardNum}`, {
        headers: new Headers({ Cookie: adminCookie }),
      });
      expect(response.status).toBe(200);
      const bodyResponse = await response.json();
      expect(bodyResponse).toHaveProperty('success', true);
      expect(bodyResponse).toHaveProperty('data');
      expect(bodyResponse.data).toMatchObject(expectedUser);
    });

    test('returns 404 if the user is not found (admin access)', async () => {
      const response = await app.request('/users/0000000000000000', {
        headers: new Headers({ Cookie: adminCookie }),
      });
      expect(response.status).toBe(404);
      const bodyResponse = await response.json();
      expect(bodyResponse).toHaveProperty('message', 'User not found');
    });
  });

  /* 
    Tests for DELETE /users/:userId route.
  */
  describe('DELETE /users/:userId', () => {
    test('deletes a user if it exists (admin access)', async () => {
      const newUser = {
        name: "Jane Doe",
        cardNum: generateTestCardNumber(),
        JHED: "janedoe",
        isAdmin: 0,
        graduationYear: 2022,
      };

      // Create the user.
      const postResponse = await app.request('/users', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
          Cookie: adminCookie,
        }),
        body: JSON.stringify(newUser),
      });
      const postBody = await postResponse.json();
      // created user is returned as an object.
      const userId = postBody.data.id;
      if (!userId) {
        throw new Error("No user ID found in POST response");
      }

      // Delete the user by id.
      const deleteResponse = await app.request(`/users/${userId}`, {
        method: 'DELETE',
        headers: new Headers({ Cookie: adminCookie }),
      });
      expect(deleteResponse.status).toBe(200);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody).toHaveProperty('message', 'User has been deleted');
    });

    test('returns 404 when trying to delete a non-existent user (admin access)', async () => {
      const response = await app.request('/users/9999999', {
        method: 'DELETE',
        headers: new Headers({ Cookie: adminCookie }),
      });
      expect(response.status).toBe(404);
      const bodyResponse = await response.json();
      expect(bodyResponse).toHaveProperty('message', 'User not found');
    });
  });
});

describe('Guard Errors', () => {
  test('returns 401 when no session is provided', async () => {
    // Make a request without any cookie.
    const response = await app.request('/users?page=1&limit=20');
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('message', 'Unauthorized');
  });

  test('returns 403 when a non-admin session is used on admin-protected routes', async () => {
    // Create a non-admin user and simulate its login.
    const testCardNum = generateTestCardNumber();
    const nonAdminUser = {
      name: "Non Admin",
      cardNum: testCardNum,
      JHED: "nonadmin",
      isAdmin: 0,
      graduationYear: 2025,
    };

    // Create the non-admin user.
    await app.request('/users', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      }),
      body: JSON.stringify(nonAdminUser),
    });
    // Simulate non-admin login.
    const nonAdminLoginResponse = await app.request(`/users/${nonAdminUser.cardNum}`);
    const nonAdminCookie = nonAdminLoginResponse.headers.get("set-cookie")?.split(";")[0] || "";

    // Attempt to access an admin-protected route using the non-admin cookie.
    const response = await app.request('/users?page=1&limit=20', {
      headers: new Headers({ Cookie: nonAdminCookie }),
    });
    expect(response.status).toBe(403);
    const bodyResp = await response.json();
    expect(bodyResp).toHaveProperty('message', 'Forbidden: Admins only');
  });
});

/* 
  Clean up test data: Delete the test user, etc.
*/
afterAll(async () => {
  await db
    .delete(users)
    .where(like(users.cardNum, '999%'))
    .execute();
  await (db.$client as any).end();
});
