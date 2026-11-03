import { createClient } from "redis";
import { redisConfig } from "../config.js";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = redisConfig;

console.log("Redis Config:", {
  host: REDIS_HOST,
  port: REDIS_PORT,
  REDIS_PASSWORD: REDIS_PASSWORD,
});

export const redisClient = createClient({
  socket: {
    host: redisConfig.REDIS_HOST,
    port: Number(redisConfig.REDIS_PORT),
    reconnectStrategy: (retries) => {
      return Math.min(retries * 1000, 5000);
    },
  },
  ...(redisConfig.REDIS_PASSWORD
    ? { password: redisConfig.REDIS_PASSWORD }
    : {}),
});

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export async function redisConnection() {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Redis connection failed retrying in 5 seconds:", error);
    setTimeout(redisConnection, 5000); // Retry after 5 seconds
  }
}

process.on("SIGINT", async () => {
  try {
    await redisClient.quit();
    console.log("Redis client disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Error during Redis client disconnection:", error);
    process.exit(1);
  }
});
