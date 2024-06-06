import { z } from "zod";

export const acceptMessageValidator = z.object({
  isAccept: z.boolean(),
});
