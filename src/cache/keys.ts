export enum DynemicKey {
  USER_TODOS = "USER_TODOS",
  USER_DETIALS = "USER_DETIALS",
}

function getDynemicKey(key: DynemicKey, userId: string) {
  return `${key}:${userId}`;
}

export function getUserTodoKey(userId: string) {
  return getDynemicKey(DynemicKey.USER_TODOS, userId);
}
