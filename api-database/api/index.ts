import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { userRoutes } from "../api-files/routes/users.js";
import { handle } from "hono/vercel";
import { auth } from "../api-files/middleware/auth.js";
import { budgetCodesRoutes } from "../api-files/routes/budgetCodes.js";
import { trainingRoutes } from "../api-files/routes/trainingValidation.js";
import { machineTypeRoutes } from "../api-files/routes/machineTypes.js";
import { machineRoutes } from "../api-files/routes/machines.js";
import { financialStatementRoutes } from "../api-files/routes/financialStatements.js";
import { userBudgetCodeRelationRoute } from "../api-files/routes/userBudgetCodeRelations.js";
import authRoutes from "../api-files/routes/auth.js";
import { emailRoutes } from "../api-files/routes/emails.js";
import { machineIssueRoute } from "../api-files/routes/machineIssueReports.js";
import { budgetCodeTypeRoutes } from "../api-files/routes/budgetCodeTypes.js";
import { statsRoutes } from "../api-files/routes/stats.js";
import { Context } from "../api-files/lib/context.js";



const app = new Hono<Context>();

app.use(logger());
app.use(
   "/*",
   cors({
     origin: (origin) => origin, // Allow any origin
     credentials: true, // Allow credentials
     allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
     allowHeaders: ["Content-Type", "Authorization"],
     exposeHeaders: ["Set-Cookie"],
   }),
 );

//Probably remove this later.
 app.get("/", (c) => {
	return c.text("Hello, Vercel");
});

app.get("/hello/:name", (c) => {
	return c.text(`Hello, ${c.req.param("name")}!`);
});

//session info for all routes
app.use("/*", auth);

app.route("/", userRoutes);
app.route("/", budgetCodesRoutes);
app.route("/", trainingRoutes);
app.route("/", machineTypeRoutes);
app.route("/", machineRoutes);
app.route("/", financialStatementRoutes);
app.route("/", userBudgetCodeRelationRoute);
app.route("/", authRoutes);
app.route("/", emailRoutes);
app.route("/", machineIssueRoute);
app.route("/", budgetCodeTypeRoutes);
app.route("/", statsRoutes);

app.onError((err, c) => {
  console.error(`${err}`);

  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }

  return c.json({ message: "An unexpected error occurred!" }, 500);
});


const appHandler = handle(app); 
export const GET = appHandler;
export const POST = appHandler;
export const PATCH = appHandler;
export const DELETE = appHandler;
export const OPTIONS = appHandler;


export default app;