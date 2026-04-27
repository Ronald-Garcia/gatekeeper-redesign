import { HTTPException } from "hono/http-exception";
import { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";

//custom class extending the httpexception, to throw zod errors to the global error handling
export class HTTPValidationException extends HTTPException {
  //added this to be able to send issue information to format an appropiate error response.
  meta: ZodError;

  constructor(status: ContentfulStatusCode, message: string, meta: ZodError) {
    super(status, { message });
    this.meta = meta;
  }
}