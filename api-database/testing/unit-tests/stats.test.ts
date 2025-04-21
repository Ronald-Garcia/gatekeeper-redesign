import { Hono } from "hono";
import { userRoutes } from "../../api-files/routes/users.js";
import { statsRoutes } from "../../api-files/routes/stats.js";
import { db } from "../../api-files/db/index.js";
import {
  users,
  budgetCodes,
  machines,
  machineTypes,
  userBudgetCodeTable,
  userMachineType,
  financialStatementsTable,
} from "../../api-files/db/schema.js";
import { eq, inArray } from "drizzle-orm";
import { Context } from "../../api-files/lib/context.js";
import { auth } from "../../api-files/middleware/auth.js";

// just use 179
async function loginAs179(app: Hono<Context>): Promise<string> {
  const response = await app.request(`/users/1198347981913945`);
  if (response.status !== 200) throw new Error("Login failed");
  return response.headers.get("set-cookie")!.split(";")[0];
}

const app = new Hono<Context>();
app.use("/*", auth);
app.route("/", userRoutes);
app.route("/", statsRoutes);
app.onError((err, c) =>
  c.json({ message: err instanceof Error ? err.message : "Error" }, (err as any)?.status || 500)
);

let userCookie: string;
const testUserId = 179;
let bc1: number, bc2: number;
let mt1: number, mt2: number;
let stmt1: number, stmt2: number;

beforeAll(async () => {
  userCookie = await loginAs179(app);

  //two budget codes
  const [{ id: b1 }] = await db.insert(budgetCodes).values({ name: "BC1", code: "CODE1", budgetCodeTypeId: 1 }).returning();
  const [{ id: b2 }] = await db.insert(budgetCodes).values({ name: "BC2", code: "CODE2", budgetCodeTypeId: 1 }).returning();
  bc1 = b1; bc2 = b2;

  // two machine types & machines
  const [{ id: mta }] = await db.insert(machineTypes).values({ name: "MT1" }).returning();
  const [{ id: ma }] = await db.insert(machines).values({ name: "M1", hourlyRate: 10, machineTypeId: mta, active: 1 }).returning();
  mt1 = mta;
  const [{ id: mtb }] = await db.insert(machineTypes).values({ name: "MT2" }).returning();
  const [{ id: mb }] = await db.insert(machines).values({ name: "M2", hourlyRate: 20, machineTypeId: mtb, active: 1 }).returning();
  mt2 = mtb;

  // relations
  await db.insert(userBudgetCodeTable).values({ userId: testUserId, budgetCodeId: bc1 });
  await db.insert(userBudgetCodeTable).values({ userId: testUserId, budgetCodeId: bc2 });
  await db.insert(userMachineType).values({ userId: testUserId, machineTypeId: mt1 });
  await db.insert(userMachineType).values({ userId: testUserId, machineTypeId: mt2 });

  // two statements same day
  const ts = new Date("2025-06-15T12:00:00Z");
  const [{ id: s1 }] = await db.insert(financialStatementsTable).values({
    userId: testUserId, budgetCode: bc1, machineId: ma, timeSpent: 120, dateAdded: ts
  }).returning();
  const [{ id: s2 }] = await db.insert(financialStatementsTable).values({
    userId: testUserId, budgetCode: bc2, machineId: mb, timeSpent: 240, dateAdded: ts
  }).returning();
  stmt1 = s1; stmt2 = s2;
});

describe("Stats Routes", () => {
  it("GET /stats returns correct total aggregation (day precision)", async () => {
    const res = await app.request("/stats?page=1&limit=10&precision=d", {
      headers: { Cookie: userCookie },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    // find the entry for 2025-06-15
    const totalEntry = body.data.total.find((e: any) =>
      e.dateAdded.startsWith("2025-06-15")
    );
    expect(totalEntry).toBeDefined();
    // 120 + 240 = 360 mins => 6 hours
    expect(totalEntry.totalTime).toBe(6);
  });

  it("filters by budgetCode", async () => {
    const res = await app.request(`/stats?page=1&limit=10&precision=d&budgetCode=${bc1}`, {
      headers: { Cookie: userCookie },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.budgetCode).toHaveLength(1);
    expect(body.data.budgetCode[0].budgetCode).toBe("BC1");
    // 120 mins => 2 hours
    expect(body.data.budgetCode[0].data[0].totalTime).toBe(2);
  });

  it("filters by machineId", async () => {
    const res = await app.request(`/stats?page=1&limit=10&precision=d&machineId=${mt2}`, {
      headers: { Cookie: userCookie },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.machine).toHaveLength(1);
    expect(body.data.machine[0].machineType).toBe("MT2");
    // 240 mins => 4 hours
    expect(body.data.machine[0].data[0].totalTime).toBe(4);
  });

  it("supports monthly precision", async () => {
    const res = await app.request("/stats?page=1&limit=5&precision=mo", {
      headers: { Cookie: userCookie },
    });
    expect(res.status).toBe(200);
    const { data } = await res.json();
    expect(data.total.every((r: any) => /^\d{4}-\d{2}$/.test(r.dateAdded))).toBe(true);
  });

  it("supports weekly precision", async () => {
    const res = await app.request("/stats?page=1&limit=5&precision=w", {
      headers: { Cookie: userCookie },
    });
    expect(res.status).toBe(200);
    const { data } = await res.json();
    expect(data.total.every((r: any) => /^2025-06-\d{2}$/.test(r.dateAdded))).toBe(true);
  });

  it("supports hourly precision", async () => {
    const res = await app.request("/stats?page=1&limit=5&precision=h", {
      headers: { Cookie: userCookie },
    });
    expect(res.status).toBe(200);
    const { data } = await res.json();
    expect(
      data.total.every((r: any) => /^\d{4}-\d{2}-\d{2} \d{2}:00:00$/.test(r.dateAdded))
    ).toBe(true);
  });

  it("supports minute precision", async () => {
    const res = await app.request("/stats?page=1&limit=5&precision=m", {
      headers: { Cookie: userCookie },
    });
    expect(res.status).toBe(200);
    const { data } = await res.json();
    expect(
      data.total.every((r: any) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:00$/.test(r.dateAdded))
    ).toBe(true);
  });

  it("filters by custom date range", async () => {
    const res = await app.request(
      "/stats?page=1&limit=5&precision=d&from=2025-06-15&to=2025-06-16",
      { headers: { Cookie: userCookie } }
    );
    expect(res.status).toBe(200);
    const { data } = await res.json();
    // we should now get exactly the 2025‑06‑15 entry
    expect(data.total).toHaveLength(1);
    expect(data.total[0].dateAdded).toContain("2025-06-15");
  });
  

  it("returns empty arrays when no data in range", async () => {
    const res = await app.request(
      "/stats?page=1&limit=5&precision=d&from=2100-01-01&to=2100-02-01",
      { headers: { Cookie: userCookie } }
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data.total)).toBe(true);
    expect(body.data.total).toHaveLength(0);
    expect(body.data.budgetCode).toHaveLength(0);
    expect(body.data.machine).toHaveLength(0);
  });

  it("respects pagination meta", async () => {
    const res = await app.request("/stats?page=2&limit=1&precision=d", {
      headers: { Cookie: userCookie },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.meta).toHaveProperty("page", 2);
    expect(body.meta).toHaveProperty("limit", 1);
  });
});

afterAll(async () => {
  // cleanup everything we inserted
  await db.delete(financialStatementsTable).where(eq(financialStatementsTable.userId, testUserId)).execute();
  await db.delete(userBudgetCodeTable).where(eq(userBudgetCodeTable.userId, testUserId)).execute();
  await db.delete(userMachineType).where(eq(userMachineType.userId, testUserId)).execute();
  await db.delete(machines).where(inArray(machines.machineTypeId, [mt1, mt2])).execute();
  await db.delete(machineTypes).where(inArray(machineTypes.id, [mt1, mt2])).execute();
  await db.delete(budgetCodes).where(inArray(budgetCodes.id, [bc1, bc2])).execute();
  await (db.$client as any).end();
});
