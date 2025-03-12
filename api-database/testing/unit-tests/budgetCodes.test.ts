import { Hono } from 'hono';
import { budgetCodesRoutes } from '../../api-files/routes/budgetCodes.js';
import { db } from '../../api-files/db/index.js';
import { budgetCodes } from '../../api-files/db/schema.js';
import { like } from 'drizzle-orm';
import { HTTPResponseError } from 'hono/types';

//Create a Hono instance and mount budgetCodes routes
const app = new Hono();
app.route('/', budgetCodesRoutes);

//error handler to return JSON responses
app.onError((err: HTTPResponseError|Error, c) => {

  if (typeof (err as any).status) {
    //return (err as any).getResponse();
    return c.json({ message: err.message }, 404);

  }
  return c.json({ message: err.message || 'Internal Server Error' }, 500);
});

//generate an 8-character budget code string
function generateTestBudgetCode(): string {
  return Math.floor(Math.random() * 1e8).toString().padStart(8, '0');
}

describe('BudgetCodes Routes', () => {
  describe('GET /budget-codes', () => {
    test('returns an array of budget codes with correct meta info', async () => {
      const response = await app.request('/budget-codes?page=1&limit=20');
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
    test('creates a budget code and returns it on response', async () => {
      const newBudgetCode = {
        name: 'Test Budget ' + generateTestBudgetCode(),
        //budgetCode must be exactly 8 characters 
        code: generateTestBudgetCode(),
      };

      const response = await app.request('/budget-codes', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newBudgetCode),
      });
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toHaveProperty('success', true);
      expect(body).toHaveProperty('data');
      expect(body.data).toMatchObject(newBudgetCode);
    });
  });

  describe('DELETE /budget-codes/:id', () => {
    test('deletes a budget code if it exists', async () => {
      // First, create a budget code to delete.
      const newBudgetCode = {
        name: 'Test Budget ' + generateTestBudgetCode(),
        code: generateTestBudgetCode(),
      };

      const postResponse = await app.request('/budget-codes', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newBudgetCode),
      });
      const postBody = await postResponse.json();
      const budgetCodeId = postBody.data.id;
      expect(budgetCodeId).toBeDefined();

      const deleteResponse = await app.request(`/budget-codes/${budgetCodeId}`, {
        method: 'DELETE',
      });
      expect(deleteResponse.status).toBe(200);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody).toHaveProperty('success', true);
      expect(deleteBody).toHaveProperty('message', 'Deleted budget code');
    });

    // this is not good 
    test('returns 404 when trying to delete a non-existent budget code', async () => {
      const response = await app.request('/budget-codes/999', { method: 'DELETE' });
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body).toHaveProperty('message',"Budget Code not found!");
    });
  });
});

//After all tests, clean up test budget codes that start with "Test Budget"
afterAll(async () => {
  await db
    .delete(budgetCodes)
    .where(like(budgetCodes.name, 'Test Budget%'))
    .execute();

    await (db.$client as any).end();
});
