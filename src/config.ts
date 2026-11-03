import dotenv from "dotenv";
dotenv.config();

export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const logDirectory = process.env.LOG_DIRECTORY;
export const Dbstring = process.env.MONGO_CONNECTION_STRING;
export const corsUrl = process.env.CORS_URL;

export const tokenInfo = {
  accessTokenValidity: parseInt(
    process.env.ACCESS_TOKEN_VALIDITY_SEC ?? "3600",
  ),
  refreshTokenValidity: parseInt(
    process.env.REFRESH_TOKEN_VALIDITY_SEC ?? "86400",
  ),
  issuer: process.env.TOKEN_ISSUER ?? "todo-backend",
  audience: process.env.TOKEN_AUDIENCE ?? "todo-frontend",
  secret: process.env.TOKEN_SECRET ?? "abc123def456",
  algorithm: process.env.TOKEN_ALGORITHM ?? "HS256",
  tokenSecret:
    process.env.TOKEN_SECRET ??
    "7f4c9b2a8e1d6f3c5a9b7e2d4c8f1a6b9e3d7c2f5a8b1e4d6c9f2a7b5e8d",
};

export const redisConfig = {
  REDIS_HOST: process.env.REDIS_HOST ?? "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT ?? "6379"),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD ?? "",
};

export const caching = {
  CONTENT_CACHE_DURAITON: process.env.CONTENT_CACHE_DURAITON_MILLIS,
};
