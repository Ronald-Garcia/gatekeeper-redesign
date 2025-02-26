import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { userRoutes } from "./routes/users";

const app = new Hono();

app.use(logger());
app.use(
   "/*",
   cors({
     origin: (origin) => origin, // Allow any origin
     // credentials: true, // Allow credentials
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


app.onError((err, c) => {
  console.error(`${err}`);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ message: "An unexpected error occurred!" }, 500);
});

export default app;
