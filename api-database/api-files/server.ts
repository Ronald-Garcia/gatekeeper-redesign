
import { serve } from "@hono/node-server";
import {GET,POST, PATCH, DELETE, OPTIONS} from "./index.js";

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

// This whole setup is so it can work with the vercel handle function. 
// Please do not touch this.

// Fetch handler routes local requests to handlers
const fetchHandler = (req:Request) => {
    // Match based on HTTP method
    switch (req.method) {
      case 'GET':
        return GET(req);
      case 'POST':
        return POST(req);
      case 'PATCH':
        return PATCH(req);
      case 'DELETE':
        return DELETE(req);
      case 'OPTIONS':
        return OPTIONS(req)
      default:
        return new Response('Method Not Allowed', { status: 405 });
    }
  };

serve({
  fetch: fetchHandler,
  port,
});
