import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";
import { BadRequestError } from "../core/CustomError.js";

export enum ValidationSource {
  BODY = "body",
  QUERY = "query",
  HEADER = "headers",
  PARAM = "params",
}

export const validateRequest = (schema: ZodType, source: ValidationSource) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source]);
      Object.assign(req[source], data);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues.map((err) => err.message).join(", ");
        console.log("Zod error:", message);

        return next(new BadRequestError(message));
      }
    }
  };
};
