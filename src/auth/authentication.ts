import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { validateTokenData } from "./utils.js";
import type { authRequest } from "../types/app-request.js";
import { validate } from "../core/JWT.js";
import { tokenInfo } from "../config.js";
import User from "../models/userModel.js";
import { BadRequestError, TokenExpiredError } from "../core/CustomError.js";
import { keyStoreModel } from "../models/keyStoreModel.js";

export default async (req: authRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken || req.headers.authorization;
  if (!accessToken) {
    return next(new BadRequestError("Access token is missing"));
  }
  req.accessToken = req.cookies.accessToken;

  try {
    const payload = await validate(req.accessToken, tokenInfo.secret);
    // console.log("logging the accesstoken payload", payload);

    validateTokenData(payload);

    const user = await User.findById(payload.sub);

    if (!user) throw new BadRequestError("User does not exists");

    req.user = user;

    const keyStore = await keyStoreModel.findOne({
      client: req.user._id,
      primaryKey: payload.prm,
      status: true,
    });

    if (!keyStore) throw new BadRequestError("Invalid access token");
    req.keystore = keyStore;
    // return next(new BadRequestError("Invalid access token"));
    next();
  } catch (err) {
    next(new TokenExpiredError("Token expired"));
  }
};
