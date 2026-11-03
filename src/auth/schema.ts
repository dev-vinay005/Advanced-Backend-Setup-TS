import { z } from "zod";
import { Header } from "./utils.js";

export const ZodAuthBearer = z
  .string()
  .refine((value) => value.startsWith("Bearer"), {
    message: "Authorization Header must start with Bearer",
  })
  .refine((value) => value.split(" ")[1], {
    message: "Authorization Header must start with Token",
  });

export default {
  apiKey: z.object({
    [Header.API_KEY]: z
      .string({
        error: "Api key is required",
      })
      .nonempty("Api key is required"),
  }),
  auth: z.object({ authorization: ZodAuthBearer }),
};
