import type { RequestHandler } from "express";
import type { ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType<unknown>;
  params?: ZodType<unknown>;
  query?: ZodType<unknown>;
};

export function validateRequest(schemas: RequestSchemas): RequestHandler {
  return (request, _response, next) => {
    if (schemas.body) {
      const parsedBody: unknown = schemas.body.parse(request.body);
      request.body = parsedBody;
    }

    if (schemas.params) {
      const parsedParams: unknown = schemas.params.parse(request.params);
      request.params = parsedParams as typeof request.params;
    }

    if (schemas.query) {
      const parsedQuery: unknown = schemas.query.parse(request.query);
      request.query = parsedQuery as typeof request.query;
    }

    next();
  };
}
