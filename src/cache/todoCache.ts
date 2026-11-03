import type { TodoDoc } from "../models/todoModel.js";
import { getUserTodoKey } from "./keys.js";
import { getJsonCache, setJsonCache } from "./query.js";
import { caching } from "../config.js";
import { redisClient } from "./index.js";

export async function saveUserTodo(userId: string, todos: TodoDoc[]) {
  const key = getUserTodoKey(userId);
  return setJsonCache(
    key,
    { data: todos },
    new Date(Date.now() + Number(caching.CONTENT_CACHE_DURAITON)),
  );
}

export async function fetchUserTodos(userId: string) {
  const key = getUserTodoKey(userId);
  return getJsonCache<{ data: TodoDoc[] }>(key);
}

export async function invalidateUserTodos(userId: string) {
  const key = getUserTodoKey(userId);
  return redisClient.del(key);
}
