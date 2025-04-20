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

async function login(cardNum: string): Promise<string> {
  const res = await app.request(`/users/${cardNum}`);
  if (res.status !== 200) throw new Error("Login failed");
  const cookie = res.headers.get("set-cookie") || "";
  return cookie.split(";")[0];
}

beforeAll(async () => {
  const adminCard = "1234567890777777";

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
        userId: 179,
        machineId: testMachineId,
        description: "Test failure to turn on"
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
  
  
    expect(res.status).toBe(200);
    const body = await res.json(); 
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
  await (db.$client as any).end();
});
