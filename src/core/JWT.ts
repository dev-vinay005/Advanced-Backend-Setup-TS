import jwt, { type SignOptions } from "jsonwebtoken";
import {
  BadRequestError,
  BadTokenError,
  InternalServerError,
  TokenExpiredError,
} from "./CustomError.js";

export class JwtPayload {
  aud: string;
  sub: string;
  iss: string;
  iat: number;
  exp: number;
  prm: string;
  constructor(
    issuer: string,
    audience: string,
    subject: string,
    payload: string,
    validity: number,
  ) {
    this.iss = issuer;
    this.aud = audience;
    this.sub = subject;
    this.iat = Math.floor(Date.now() / 1000);
    this.exp = this.iat + validity;
    this.prm = payload;
  }
}

export function encode(payload: JwtPayload, secret: string): Promise<string> {
  try {
    // if (!secret) throw new InternalServerError("Token generation faliure");
    if (!secret) throw new InternalServerError("JWT secrate is missing");
    const options: SignOptions = {
      algorithm: "HS256",
    };
    return new Promise((res, rej) => {
      jwt.sign({ ...payload }, secret, options, (err, token) => {
        if (err) {
          return rej(new InternalServerError("Token generation faliure  "));
        }
        res(token as string);
      });
    });
  } catch (err) {
    throw err;
  }
}

export async function decode(token: string): Promise<JwtPayload> {
  try {
    if (!token) throw new InternalServerError("Token decoded faliure");

    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") throw new BadTokenError();

    return decoded as JwtPayload;
  } catch (err) {
    throw err;
  }
}

export function validate(
  token: string | undefined,
  secrate: string,
): Promise<JwtPayload> {
  try {
    if (!token) throw new InternalServerError("Token validation faliure");
    return new Promise((res, rej) => {
      jwt.verify(token, secrate, (err, token) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return rej(new TokenExpiredError());
          }
          return rej(
            new BadRequestError("Token validation faliure, Invalid Token"),
          );
        }
        res(token as JwtPayload);
      });
    });
  } catch (err) {
    throw err;
  }
}
