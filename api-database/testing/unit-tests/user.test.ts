import { Hono } from 'hono';
import { userRoutes } from '../../api-files/routes/users.js';
import { db } from '../../api-files/db/index.js';
import { users } from '../../api-files/db/schema.js';
import { like } from 'drizzle-orm';
import { Context } from '../../api-files/lib/context.js';
import { auth } from '../../api-files/middleware/auth.js';

// Create a new Hono instance and mount the user routes
const app = new Hono<Context>();
app.use("/*", auth);
app.route('/', userRoutes);

// Add an error handler so that errors are returned as JSON, will not work without this
app.onError((err, c) => {
  if (err instanceof Error && 'status' in err) {
    return c.json({ message: err.message }, (err as any).status || 400);
  }
  return c.json({ message: 'Internal Server Error' }, 500);
});

//Helper to generate a unique 15-digit card number for tests that always starts with "999"
function generateTestCardNumber(): string {
  // 999 + 12 random digits, makes it easieer to delete from teh data base 
  const randomPart = Math.floor(Math.random() * 1e13)
    .toString()
    .padStart(13, '0');
  return "999" + randomPart;
}

describe('User Routes', () => {
  describe('GET /users', () => {
    test('returns an array of users with correct meta info', async () => {
      const response = await app.request('/users?page=1&limit=20');
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

  describe('POST /users', () => {
    test('creates a user and returns it on response', async () => {

      const testCardNum = generateTestCardNumber();
      const newUser = {
        name: "Ronald Cameron",
        cardNum: testCardNum, // unique 15-digit test card number
        JHED: "roncam",
        isAdmin: 1,
        graduationYear: 2024,
      };

      const newUserRes = {
        name: "Ronald Cameron",
        cardNum: testCardNum.substring(0, testCardNum.length - 1), // unique 15-digit test card number
        lastDigitOfCardNum: Number.parseInt(testCardNum.at(testCardNum.length - 1) as string),
        JHED: "roncam",
        isAdmin: 1,
        graduationYear: 2024,
      };

      const response = await app.request('/users', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newUser),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      // Assuming the created user is returned as the first element in data:
      expect(body.data[0]).toMatchObject(newUserRes);
    });

    test('returns 409 when a user with the same card number already exists', async () => {
      // Use a fixed test card number for this duplicate test
      const duplicateCardNum = generateTestCardNumber();
      const duplicateUser = {
        name: "Test User",
        cardNum: duplicateCardNum,
        lastDigitOfCardNum: 5,
        JHED: "testuser",
        isAdmin: 0,
        graduationYear: 2024,
      };

      //First creation should succeed
      await app.request('/users', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(duplicateUser),
      });

      // Second creation with the same cardNum should fail with a 409 error
      const response = await app.request('/users', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(duplicateUser),
      });


      expect(response.status).toBe(409);
      const body = await response.json();
      expect(body).toHaveProperty('message', 'User with this card number already exists.');
    });
  });

  describe('GET /users/:cardNum/:lastDigitOfCardNum', () => {
    test('returns a user if one exists', async () => {
      const testCardNum = generateTestCardNumber();
      const newUser = {
        name: "John Doe",
        cardNum: testCardNum, // unique 15-digit test card number
        JHED: "johndoe",
        isAdmin: 0,
        graduationYear: 2023,
      };

      const newUserRes = {
        name: "John Doe",
        cardNum: testCardNum.substring(0, testCardNum.length - 1), 
        lastDigitOfCardNum: Number.parseInt(testCardNum.at(testCardNum.length - 1) as string),
        JHED: "johndoe",
        isAdmin: 0,
        graduationYear: 2023,
      };

      // Create the user first
      await app.request('/users', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newUser),
      });

      // Retrieve the user by card number and last digit
      const response = await app.request(`/users/${newUser.cardNum}`);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(body.data).toMatchObject(newUserRes);
    });

    test('returns 404 if the user is not found', async () => {
      const response = await app.request('/users/0000000000000000');
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty('message', 'User not found');
    });
  });

  describe('DELETE /users/:userId', () => {
    test('deletes a user if it exists', async () => {
      const newUser = {
        name: "Jane Doe",
        cardNum: generateTestCardNumber(), // unique test card number
        lastDigitOfCardNum: 2,
        JHED: "janedoe",
        isAdmin: 0,
        graduationYear: 2022,
      };

      // Create the user
      const postResponse = await app.request('/users', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newUser),
      });
      const postBody = await postResponse.json();
      // Assume the created user is returned as the first element in data and has an id property
      const userId = postBody.data[0].id;

      // Delete the user by id
      const deleteResponse = await app.request(`/users/${userId}`, {
        method: 'DELETE'
      });
      expect(deleteResponse.status).toBe(200);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody).toHaveProperty('message', 'User has been deleted');
    });

    test('returns 404 when trying to delete a non-existent user', async () => {
      const response = await app.request('/users/9999999', { method: 'DELETE' });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty('message', 'User not found');
    });
  });
});

// clean testing data from data base
afterAll(async () => {
  await db
    .delete(users)
    .where(
      like(users.cardNum, '999%')
    )
    .execute();
    await (db.$client as any).end();
  }
)