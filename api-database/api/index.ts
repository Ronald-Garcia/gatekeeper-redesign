import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { userRoutes } from "./routes/users.js";
import { handle } from "hono/vercel";
import { budgetCodes } from "./db/schema.js";
import { budgetCodesRoutes } from "./routes/budgetCodes.js";
import { trainingRoutes } from "./routes/trainingValidation.js";
import { machineTypeRoutes } from "./routes/machineTypes.js";
import { machineRoutes } from "./routes/machines.js";


const app = new Hono();

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


 app.get("/", (c) => {
	return c.text("Hello, Vercel!!!!");
});

app.get("/hello/:name", (c) => {
	return c.text(`Hello, ${c.req.param("name")}!`);
});

app.route("/", userRoutes);
app.route("/", budgetCodesRoutes);
app.route("/", trainingRoutes);
app.route("/", machineTypeRoutes);
app.route("/", machineRoutes);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      err.status,
    );
  }

  return c.json(
    {
      success: false,
      message: "An unexpected error occurred!",
    },
    500,
  );
});


const appHandler = handle(app); 
export const GET = appHandler;
export const POST = appHandler;
export const PATCH = appHandler;
export const DELETE = appHandler;
