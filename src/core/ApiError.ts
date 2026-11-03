import type { Response } from "express";
import { environment } from "../config.js";

export enum ErrorType {
  BAD_REQUEST = "BadRequest",
  NOT_FOUND = "NotFound",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  INTERNAL_SERVER_ERROR = "InternalServerError",
  TOKEN_EXPIRED = "TokenExpired",
  BAD_TOKEN = "BadToken",
  ACCESS_TOKEN_ERROR = "AccessTokenError",
  REFRESH_TOKEN_ERROR = "RefreshTokenError",
  INVALID_CREDENTIALS = "InvalidCredentials",
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorType: ErrorType;

  constructor(type: ErrorType, statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = type;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static handle(err: ApiError, res: Response) {
    res.status(err.statusCode || 500).json({
      type: err.errorType || ErrorType.INTERNAL_SERVER_ERROR,
      message: err.message || "Internal Server Error",
      stack: environment === "development" ? err.stack : null,
    });
  }
}
