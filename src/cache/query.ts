import { redisClient } from "./index.js";

export async function setJsonCache(
  key: string,
  value: Record<string, unknown>,
  expireAt: Date | null,
) {
  const jsonString = JSON.stringify(value);
  if (expireAt) {
    const ttl = expireAt.getTime() - Date.now();
    return redisClient.set(key, jsonString, { PX: ttl });
  } else {
    return redisClient.set(key, jsonString);
  }
}

export async function getJsonCache<T>(key: string) {
  const type = await redisClient.type(key);
  if (type !== "string") return null;

  const json = await redisClient.get(key);
  if (json) return JSON.parse(json) as T;

  return null;
}
