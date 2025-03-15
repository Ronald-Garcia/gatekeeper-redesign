// budgetCodes.test.ts
import { Hono } from 'hono';
import { budgetCodesRoutes } from '../../api-files/routes/budgetCodes.js';
import { db } from '../../api-files/db/index.js';
import { budgetCodes } from '../../api-files/db/schema.js';
import { like, eq } from 'drizzle-orm';
import { Context } from '../../api-files/lib/context.js';
import { auth } from '../../api-files/middleware/auth.js';
import { adminGuard } from '../../api-files/middleware/adminGuard.js';
import { userRoutes } from '../../api-files/routes/users.js';

// Helper to simulate admin login.
async function adminLogin(app: Hono<Context>): Promise<string> {
  const adminCardNum = "1234567890777777";
  const response = await app.request(`/users/${adminCardNum}`);
  if (response.status !== 200) throw new Error("Admin login failed");
  const setCookie = response.headers.get("set-cookie") || "";
  return setCookie.split(";")[0];
}

// Helper to generate an 8-character budget code.
function generateTestBudgetCode(): string {
  return Math.floor(Math.random() * 1e8).toString().padStart(8, '0');
}

const app = new Hono<Context>();
app.use("/*", auth);
app.route('/', userRoutes);
app.route('/', budgetCodesRoutes);

app.onError((err, c) => {
  if (err instanceof Error && 'status' in err) {
    return c.json({ message: err.message }, (err as any).status || 404);
  }
  return c.json({ message: err.message || 'Internal Server Error' }, 500);
});

let adminCookie = "";
beforeAll(async () => {
  adminCookie = await adminLogin(app);
});

describe('BudgetCodes Routes', () => {
  describe('GET /budget-codes', () => {
    test('returns an array of budget codes with correct meta info (admin access)', async () => {
      const response = await app.request('/budget-codes?page=1&limit=20', {
        headers: new Headers({ Cookie: adminCookie })
      });
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body).toHaveProperty('meta');
      expect(body.meta).toHaveProperty('page', 1);
      expect(body.meta).toHaveProperty('limit', 20);
      expect(body).toHaveProperty('message');
    });
  });

  describe('POST /budget-codes', () => {
    test('creates a budget code and returns it (admin access)', async () => {
      const newBudgetCode = {
        name: 'Test Budget ' + generateTestBudgetCode(),
        code: generateTestBudgetCode(),
      };
      const response = await app.request('/budget-codes', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json', Cookie: adminCookie }),
        body: JSON.stringify(newBudgetCode)
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(body.data).toMatchObject(newBudgetCode);
    });
  });

  describe('DELETE /budget-codes/:id', () => {
    test('deletes a budget code if it exists (admin access)', async () => {
      const newBudgetCode = {
        name: 'Test Budget ' + generateTestBudgetCode(),
        code: generateTestBudgetCode(),
      };
      const postResponse = await app.request('/budget-codes', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json', Cookie: adminCookie }),
        body: JSON.stringify(newBudgetCode)
      });
      const postBody = await postResponse.json();
      const budgetCodeId = postBody.data.id;
      expect(budgetCodeId).toBeDefined();
      const deleteResponse = await app.request(`/budget-codes/${budgetCodeId}`, {
        method: 'DELETE',
        headers: new Headers({ Cookie: adminCookie })
      });
      expect(deleteResponse.status).toBe(200);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody).toHaveProperty('success', true);
      expect(deleteBody).toHaveProperty('message', 'Deleted budget code');
    });

    test('returns 404 when trying to delete a non-existent budget code (admin access)', async () => {
      const response = await app.request('/budget-codes/999', {
        method: 'DELETE',
        headers: new Headers({ Cookie: adminCookie })
      });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty('message', "Budget Code not found!");
    });
  });
});

afterAll(async () => {
  await db.delete(budgetCodes).where(like(budgetCodes.name, 'Test Budget%')).execute();
  await (db.$client as any).end();
});
