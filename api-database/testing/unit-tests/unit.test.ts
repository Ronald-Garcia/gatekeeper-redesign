import { Hono } from 'hono';
import { userRoutes } from '../../api-files/routes/users';

//create hono instance and then mount routes on it
const app = new Hono();
app.route('/', userRoutes);

// User route tests
describe('User Routes', () => {
  // GET route test
  test('GET /users returns an array of users with correct meta info', async () => {

    const response = await app.request('/users?page=1&limit=20');
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('data'); 
    expect(body).toHaveProperty('meta');
    expect(body.meta).toHaveProperty('page', 1);
    expect(body.meta).toHaveProperty('limit', 20);
    expect(body).toHaveProperty('message', 'Fetched user routes');
  });


  /*
  test('POST /users creates a user and returns it', async () => {
    const newUser = {
      name: "Ronald Cameron",
      cardNum: "12345678901444",
      lastDigitOfCardNum: 4,
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

    expect(body.data[0]).toMatchObject(newUser);
  });*/
});
