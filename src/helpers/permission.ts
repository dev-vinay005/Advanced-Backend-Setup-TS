import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { Permission } from "../models/apikeyModel.js";
import type { PublicRequest } from "../types/app-request.js";
import { ForbiddenError } from "../core/CustomError.js";

function permission(permission: Permission): RequestHandler {
  return (req: PublicRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.apiKey?.permissions) {
        return next(new ForbiddenError("Permission Denied"));
      }

      const exists = req.apiKey.permissions.includes(permission as Permission);
      if (!exists) {
        return next(new ForbiddenError("Permission Denied"));
      }

      next();
    } catch (err) {}
  };
}

export { permission };
