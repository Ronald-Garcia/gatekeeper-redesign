import { Hono } from 'hono';
import { machineTypeRoutes } from '../../api-files/routes/machineTypes.js';
import { db } from '../../api-files/db/index.js';
import { budgetCodes } from '../../api-files/db/schema.js';
import { like } from 'drizzle-orm';

const app = new Hono();
app.route('/', machineTypeRoutes);

// to retunr the errors as json for the tests
app.onError((err, c) => {
    if (typeof (err as any).getResponse === 'function') {
      return (err as any).getResponse();
    }
    return c.json({ message: err.message || 'Internal Server Error' }, 500);
  });
  

describe('MachineType Routes tests', () => {
    describe('GET /machine-types', () => {
        test("return an array of machineTypes with correct info", async() => {
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
        })
    })



})

