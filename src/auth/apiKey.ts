import { validateRequest, ValidationSource } from "../helpers/validator.js";
import express, { type NextFunction, type Response } from "express";
import ApiKeySchema from "./schema.js";
import { Header } from "./utils.js";
import { ForbiddenError } from "../core/CustomError.js";
import { findByKey } from "../controllers/apiKeyController.js";
import type { PublicRequest } from "../types/app-request.js";

const router: express.Router = express.Router();

// router.use(
//   validateRequest(ApiKeySchema, ValidationSource.HEADER),
//   async (req: PublicRequest, res: Response, next: NextFunction) => {
//     const key = req.headers[Header.API_KEY]?.toString();
//     if (!key) {
//       return next(
//         new ForbiddenError("API key is required to access this resource."),
//       );
//     }

//     const apiKey = await findByKey(key);
//     if (!apiKey) {
//       return next(
//         new ForbiddenError("Invalid API key. Please provide a valid API key."),
//       );
//     }
//     req.apiKey = apiKey;

//     next();
//   },
// );

// export default router;

export default async (
  req: PublicRequest,
  res: Response,
  next: NextFunction,
) => {
  const key = req.headers[Header.API_KEY]?.toString();
  console.log("logging the Api Key:", key);

  if (!key) {
    return next(
      new ForbiddenError("API key is required to access this resource."),
    );
  }

  const apiKey = await findByKey(key);
  if (!apiKey) {
    return next(
      new ForbiddenError("Invalid API key. Please provide a valid API key."),
    );
  }
  req.apiKey = apiKey;

  next();
};
