import { z } from "zod";

export const verifiedCodeHandler = z.object({
  code: z.string().length(6, { message: "Verified Code is 6 characters" }),
});
