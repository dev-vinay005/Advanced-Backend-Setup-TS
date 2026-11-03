import { apiKeyModel, type ApiKeyDoc } from "../models/apikeyModel.js";

export const findByKey = async (Key: string): Promise<ApiKeyDoc | null> => {
  return await apiKeyModel.findOne({ Key, status: true });
};
