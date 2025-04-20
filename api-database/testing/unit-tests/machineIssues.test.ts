import { Hono } from "hono";
import { machineIssueRoute } from "../../api-files/routes/machineIssueReports";
import { userRoutes } from "../../api-files/routes/users"; 
import { db } from "../../api-files/db/index";
import { users, machines, machineTypes, machineIssues } from "../../api-files/db/schema"; 
import { Context } from "../../api-files/lib/context";
import { auth } from "../../api-files/middleware/auth";
import { eq } from "drizzle-orm";

const app = new Hono<Context>();
app.use("/*", auth);
app.route("/", userRoutes);          
app.route("/", machineIssueRoute);  

let adminCookie: string;
let testUserId: number;
let testMachineId: number;
let testMachineTypeId: number;
let createdIssueId: number;

function generateTestCardNumber(): string {
  const random = Math.floor(Math.random() * 1e13).toString().padStart(13, "0");
  return "999" + random;
}

async function login(cardNum: string): Promise<string> {
  const res = await app.request(`/users/${cardNum}`);
  if (res.status !== 200) throw new Error("Login failed");
  const cookie = res.headers.get("set-cookie") || "";
  return cookie.split(";")[0];
}

beforeAll(async () => {
  const adminCard = "1234567890777777";

  await db.insert(users).values({
    name: "Admin User",
    cardNum: adminCard,
    lastDigitOfCardNum: parseInt(adminCard.slice(-1)),
    JHED: "adminjhed",
    isAdmin: 1,
    graduationYear: 2025,
    active: 1,
  }).onConflictDoNothing();

  const [machineType] = await db.insert(machineTypes).values({
    name: "Test Type " + Math.random().toString().slice(2, 6),
  }).returning();
  testMachineTypeId = machineType.id;

  const [machine] = await db.insert(machines).values({
    name: "Test Lathe",
    hourlyRate: 10,
    machineTypeId: testMachineTypeId,
    active: 1,
  }).returning();
  testMachineId = machine.id;

  const cardNum = generateTestCardNumber();
  const [user] = await db.insert(users).values({
    name: "Test User",
    cardNum,
    lastDigitOfCardNum: parseInt(cardNum.slice(-1)),
    JHED: "testjhed",
    isAdmin: 0,
    graduationYear: 2025,
    active: 1,
  }).returning();
  testUserId = user.id;

  adminCookie = await login(adminCard);
});

describe("Machine Issue Routes", () => {
  test("POST /machine-issues - report a new issue", async () => {
    const res = await app.request("/machine-issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        userId: testUserId,
        machineId: testMachineId,
        description: "Test failure to turn on",
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.description).toBe("Test failure to turn on");
    createdIssueId = body.data.id;
  });

  test("PATCH /machine-issues/:id - resolve the issue", async () => {
    const res = await app.request(`/machine-issues/${createdIssueId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({ resolved: "1" }), 
    });
  
    const text = await res.text();
    console.log("PATCH /machine-issues response:", res.status, text);
  
    expect(res.status).toBe(200);
  
    const body = JSON.parse(text);  //Parse manually since .json() can't be reused
    expect(body.success).toBe(true);
    expect(body.data.resolved).toBe(1);  
  });
  
  
  

  test("GET /machine-issues - fetch list of issues", async () => {
    const res = await app.request("/machine-issues?limit=10&page=1&sort=desc", {
      method: "GET",
      headers: { Cookie: adminCookie },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]).toHaveProperty("user");
    expect(body.data[0]).toHaveProperty("machine");
  });
});

afterAll(async () => {
  await db.delete(machineIssues).where(eq(machineIssues.id, createdIssueId));
  await db.delete(machines).where(eq(machines.id, testMachineId));
  await db.delete(machineTypes).where(eq(machineTypes.id, testMachineTypeId));
  await db.delete(users).where(eq(users.id, testUserId));
  await (db.$client as any).end();
});
