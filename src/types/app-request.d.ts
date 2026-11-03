import type { Request } from "express";
import type { ApiKeyDoc } from "../models/apikeyModel.ts";
import type KeyStoreDoc from "../models/keyStoreModel.ts";
import type { UserDoc } from "../models/userModel.ts";

declare interface protectedRequest extends Request {
  user?: any;
}

declare interface PublicRequest extends Request {
  apiKey?: ApiKeyDoc;
}
declare interface authRequest extends Request {
  user?: UserDoc;
  accessToken?: string | undefined;
  keystore?: KeyStoreDoc;
}
