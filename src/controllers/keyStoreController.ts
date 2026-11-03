import type mongoose from "mongoose";
import { keyStoreModel } from "../models/keyStoreModel.js";
import type { UserDoc } from "../models/userModel.js";

async function create(
  client: mongoose.Types.ObjectId,
  primaryKey: string,
  secondaryKey: string,
) {
  const keys = await keyStoreModel.create({
    client,
    primaryKey,
    secondaryKey,
  });

  return keys;
}

export { create };
