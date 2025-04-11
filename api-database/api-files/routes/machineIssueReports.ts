import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  createMachineIssueSchema,
  updateMachineIssueParamSchema,
  updateMachineIssueBodySchema,
  queryMachineIssuesSchema,
  getIssuesOfMachineSchema,
} from "../validators/machineIssueReportSchema.js";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { machineIssues, machines, users } from "../db/schema.js";
import { HTTPException } from "hono/http-exception";
import { authGuard } from "../middleware/authGuard.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { Context } from "../lib/context.js";
import { inactivateGraduatedUsers } from "../middleware/gradYearRemoval.js";

export const machineIssueRoute = new Hono<Context>();

machineIssueRoute.get(
  "/machine-issues",
  adminGuard,
  inactivateGraduatedUsers,
  zValidator("query", queryMachineIssuesSchema),
  async (c) => {
    const { page = 1, limit = 20, sort, resolved } = c.req.valid("query");

    const whereClause = resolved !== undefined ? [eq(machineIssues.resolved, resolved)] : [];
    const orderByClause =
      sort === "desc" ? desc(machineIssues.reportedAt) : asc(machineIssues.reportedAt);

    whereClause.push(eq(users.active, 1));

    const offset = (page - 1) * limit;

    const [issues, [{ totalCount }]] = await Promise.all([
      db
        .select({
          id: machineIssues.id,
          description: machineIssues.description, // ✅ include description
          user: {
            id: machineIssues.userId,
            name: users.name,
            JHED: users.JHED,
          },
          machine: {
            id: machines.id,
            name: machines.name,
          },
          resolved: machineIssues.resolved,
          reportedAt: machineIssues.reportedAt,
        })
        .from(machineIssues)
        .innerJoin(users, eq(machineIssues.userId, users.id))
        .innerJoin(machines, eq(machineIssues.machineId, machines.id))
        .where(and(...whereClause))
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db
        .select({ totalCount: count() })
        .from(machineIssues)
        .innerJoin(users, eq(machineIssues.userId, users.id))
        .where(and(...whereClause)),
    ]);

    return c.json({
      success: true,
      data: issues,
      meta: {
        page,
        limit,
        total: totalCount,
      },
      message: "Fetched machine issue reports",
    });
  }
);

// ✅ POST new machine issue report
machineIssueRoute.post(
    "/machine-issues",
    authGuard,
    inactivateGraduatedUsers,
    zValidator("json", createMachineIssueSchema),
    async (c) => {
      console.log("Reached POST /machine-issues route");
  
      try {
        const body = c.req.valid("json");
        console.log("📩 Received machine issue body:", body);
  
        const { userId, machineId, description } = body;
  
        const [user] = await db
          .select()
          .from(users)
          .where(and(eq(users.id, userId), eq(users.active, 1)));
  
        if (!user) {
          console.warn("⚠️ User not found or inactive:", userId);
          throw new HTTPException(404, { message: "User not found" });
        }
  
        const [machine] = await db
          .select()
          .from(machines)
          .where(eq(machines.id, machineId));
  
        if (!machine) {
          console.warn("⚠️ Machine not found:", machineId);
          throw new HTTPException(404, { message: "Machine not found" });
        }
  
        const [issue] = await db
          .insert(machineIssues)
          .values({
            userId,
            machineId,
            description, 
          })
          .returning();
  
        console.log("Issue successfully inserted:", issue);
  
        return c.json(
          {
            success: true,
            message: "Machine issue reported successfully.",
            data: issue,
          },
          201
        );
      } catch (err) {
        console.error("Failed to create machine issue:", err);
  
        return c.json(
          {
            success: false,
            message: "Failed to report issue",
            error: `${err}`,
          },
          500
        );
      }
    }
  );
  

// ✅ PATCH update issue (resolve/unresolve)
machineIssueRoute.patch(
  "/machine-issues/:id",
  adminGuard,
  zValidator("param", updateMachineIssueParamSchema),
  zValidator("json", updateMachineIssueBodySchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { resolved } = c.req.valid("json");

    const [updatedIssue] = await db
      .update(machineIssues)
      .set({ resolved })
      .where(eq(machineIssues.id, id))
      .returning();

    if (!updatedIssue) {
      throw new HTTPException(404, { message: "Issue not found." });
    }

    return c.json({
      success: true,
      message: "Machine issue updated successfully.",
      data: updatedIssue,
    });
  }
);

// ✅ GET issues for a single machine
machineIssueRoute.get(
  "/machine-issues/:machineId",
  adminGuard,
  zValidator("query", queryMachineIssuesSchema),
  zValidator("param", getIssuesOfMachineSchema),
  async (c) => {
    const { page = 1, limit = 20, sort, resolved } = c.req.valid("query");
    const { machineId } = c.req.valid("param");

    const whereClause = resolved !== undefined ? [eq(machineIssues.resolved, resolved)] : [];
    const orderByClause =
      sort === "desc" ? desc(machineIssues.reportedAt) : asc(machineIssues.reportedAt);

    whereClause.push(eq(machineIssues.machineId, machineId));

    const offset = (page - 1) * limit;

    const [issues, [{ totalCount }]] = await Promise.all([
      db
        .select({
          user: {
            id: machineIssues.userId,
            description: machineIssues.description,
            name: users.name,
            JHED: users.JHED,
          },
          machine: {
            id: machines.id,
            name: machines.name,
          },
        })
        .from(machineIssues)
        .innerJoin(users, eq(machineIssues.userId, users.id))
        .innerJoin(machines, eq(machineIssues.machineId, machines.id))
        .where(and(...whereClause))
        .orderBy(orderByClause)
        .limit(limit)
        .offset(offset),

      db.select({ totalCount: count() }).from(machineIssues).where(and(...whereClause)),
    ]);

    return c.json({
      success: true,
      data: issues,
      meta: {
        page,
        limit,
        total: totalCount,
      },
      message: "Fetched machine issue reports",
    });
  }
);