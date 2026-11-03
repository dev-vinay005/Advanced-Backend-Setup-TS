import { Types } from "mongoose";
import { tokenInfo } from "../config.js";
import { BadRequestError, InternalServerError } from "../core/CustomError.js";
import { encode, JwtPayload } from "../core/JWT.js";
import type { UserDoc } from "../models/userModel.js";

export enum Header {
  API_KEY = "x-api-key",
}

export async function createTokens(
  user: UserDoc,
  accessTokenKey: string,
  refreshTokenKey: string,
) {
  const accessToken = await encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      accessTokenKey,
      tokenInfo.accessTokenValidity,
    ),
    tokenInfo.tokenSecret,
  );

  if (!accessToken) throw new InternalServerError();

  const refreshToken = await encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      refreshTokenKey,
      tokenInfo.refreshTokenValidity,
    ),
    tokenInfo.tokenSecret,
  );

  if (!refreshToken) throw new InternalServerError();

  return { accessToken, refreshToken };
}

export const getAccessToken = (authorization: string | undefined) => {
  if (!authorization) {
    throw new BadRequestError("Invalid Authorization");
  }
  if (!authorization.startsWith("Brearer")) {
    throw new BadRequestError("Invalid Authorization");
  }

  return authorization.split(" ")[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  if (
    !payload ||
    !payload.iss ||
    !payload.aud ||
    !payload.sub ||
    !payload.prm ||
    payload.iss !== tokenInfo.issuer ||
    payload.aud !== tokenInfo.audience ||
    !Types.ObjectId.isValid(payload.sub)
  ) {
    throw new BadRequestError("Invalid access Token");
  }

  return true;
};
