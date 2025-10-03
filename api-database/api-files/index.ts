import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { userRoutes } from "./routes/users.js";
import { handle } from "hono/vercel";
import { budgetCodesRoutes } from "./routes/budgetCodes.js";
import { machineRoutes } from "./routes/machines.js";
import { trainingRoutes } from "./routes/trainingValidation.js";
import { machineTypeRoutes } from "./routes/machineTypes.js";
import { financialStatementRoutes } from "./routes/financialStatements.js";
import { userBudgetCodeRelationRoute } from "./routes/userBudgetCodeRelations.js";
import type { Context } from "./lib/context.js";
import { auth } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import { emailRoutes } from "./routes/emails.js";
import { machineIssueRoute } from "./routes/machineIssueReports.js";
import { budgetCodeType } from "./db/schema.js";
import { budgetCodeTypeRoutes } from "./routes/budgetCodeTypes.js";
import { statsRoutes } from "./routes/stats.js";
import { HTTPValidationException } from "./validators/httpvalidationexception.js";
import { adminPassKeyRoutes } from "./routes/adminPasskeyRoutes.js";


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
app.route("/", adminPassKeyRoutes);

app.onError((err, c) => {
  console.error(`${err}`);

  if (err instanceof HTTPValidationException) {
    const zodError = err.meta;
    const response = {
      success: false,
      //detailed message that will be relayed to the user.
      message: zodError.issues
        .map((issue) => `${issue.path.join(".")} : ${issue.message}`)
        .join(", "),
      meta: {
        issues: zodError.issues.map((issue) => {
          const formattedResponse: any = {
            code: issue.code,
            path: issue.path,
            message: issue.message,
          };
          //not all error messages have expected and received, but if they do include them properly in response

          if ("expected" in issue) {
            formattedResponse.expected = (issue as any).expected;
          }
          if ("received" in issue) {
            formattedResponse.received = (issue as any).received;
          }
          return formattedResponse;
        }),
        name: zodError.name,
      },
    };

    return c.json(response, err.status);
  }

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