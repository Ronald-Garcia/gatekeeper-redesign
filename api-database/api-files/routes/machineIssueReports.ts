import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createMachineIssueSchema, updateMachineIssueParamSchema, updateMachineIssueBodySchema, queryMachineIssuesSchema, getIssuesOfMachineSchema } from "../validators/machineIssueReportSchema.js";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { machineIssues, machines, users } from "../db/schema.js";
import { HTTPException } from "hono/http-exception";
import { authGuard } from "../middleware/authGuard.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { Context } from "../lib/context.js";
import { inactivateGraduatedUsers } from "../middleware/gradYearRemoval.js";

export const machineIssueRoute = new Hono<Context>();

// Get machine issues (with filtering and pagination)
machineIssueRoute.get("/machine-issues", 
    adminGuard,
    inactivateGraduatedUsers,
    zValidator("query", queryMachineIssuesSchema),
    async (c) => {
        const { page = 1, limit = 20, sort, resolved } = c.req.valid("query");

        const whereClause = resolved !== undefined ? [eq(machineIssues.resolved, resolved)] : [];
        const orderByClause = sort === "desc" ? desc(machineIssues.reportedAt) : asc(machineIssues.reportedAt);

        whereClause.push(eq(users.active, 1));

        const offset = (page - 1) * limit;

        const [issues, [{ totalCount }]] = await Promise.all([
            db.select({
                id: machineIssues.id,
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
            
            db.select({ totalCount: count() })
                .from(machineIssues)
                .innerJoin(users, eq(machineIssues.userId, users.id))
                .where(and(...whereClause))
        ]);

        return c.json({
            success: true,
            data: issues,
            meta: {
                page,
                limit,
                total: totalCount,
            },
            message: "Fetched machine issue reports"
        });
    }
);

// Create a new machine issue report
machineIssueRoute.post("/machine-issues", 
    authGuard,
    inactivateGraduatedUsers,
    zValidator("json", createMachineIssueSchema),
    async (c) => {
        const { userId, machineId } = c.req.valid("json");

        // Validate user and machine exist
        const [user] = await db.select().from(users).where(and(eq(users.id, userId), eq(users.active, 1)));
        if (!user) throw new HTTPException(404, { message: "User not found" });

        const [machine] = await db.select().from(machines).where(eq(machines.id, machineId));
        if (!machine) throw new HTTPException(404, { message: "Machine not found" });

        // Insert new issue report
        const [issue] = await db.insert(machineIssues)
            .values({
                userId,
                machineId,
            }).returning();

        return c.json({
            success: true,
            message: "Machine issue reported successfully.",
            data: issue
        }, 201);
    }
);

// Update issue status (resolve/unresolve)
machineIssueRoute.patch("/machine-issues/:id", 
    adminGuard,
    zValidator("param", updateMachineIssueParamSchema),
    zValidator("json", updateMachineIssueBodySchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { resolved } = c.req.valid("json");
  
      const [updatedIssue] = await db.update(machineIssues)
        .set({ resolved })
        .where(eq(machineIssues.id, id))
        .returning();
  
      if (!updatedIssue) {
        throw new HTTPException(404, { message: "Issue not found." });
      }
  
      return c.json({
        success: true,
        message: "Machine issue updated successfully.",
        data: updatedIssue
      });
    }
  );
  


// Get machine issues (with filtering and pagination)
machineIssueRoute.get("/machine-issues/:machineId", 
    adminGuard,
    zValidator("query", queryMachineIssuesSchema),
    zValidator("param", getIssuesOfMachineSchema),
    async (c) => {
        const { page = 1, limit = 20, sort, resolved } = c.req.valid("query");
        const { machineId } = c.req.valid("param");

        const whereClause = resolved !== undefined ? [eq(machineIssues.resolved, resolved)] : [];
        const orderByClause = sort === "desc" ? desc(machineIssues.reportedAt) : asc(machineIssues.reportedAt);

        whereClause.push(eq(machineIssues.machineId, machineId));

        const offset = (page - 1) * limit;

        const [issues, [{ totalCount }]] = await Promise.all([
            db.select({
                user: {
                    id: machineIssues.userId,
                    name: users.name,
                    JHED: users.JHED,
                },
                machine: {
                    id: machines.id,
                    name: machines.name,
                }
            })
                .from(machineIssues)
                .innerJoin(users, eq(machineIssues.userId, users.id))
                .innerJoin(machines, eq(machineIssues.machineId, machines.id))
                .where(and(...whereClause))
                .orderBy(orderByClause)
                .limit(limit)
                .offset(offset),
            
            db.select({ totalCount: count() })
                .from(machineIssues)
                .where(and(...whereClause))
        ]);

        return c.json({
            success: true,
            data: issues,
            meta: {
                page,
                limit,
                total: totalCount,
            },
            message: "Fetched machine issue reports"
        });
    }
);

