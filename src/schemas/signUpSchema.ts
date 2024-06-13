import { z } from "zod";

export const signUpValidator = z.object({
  username: z
    .string()
    .min(2, "minimum 2 characters required for username")
    .max(20, "maximum 20 characters allowed for username")
    .regex(/^[a-z0-9]{MIN_CHARS,MAX_CHARS}$/i),

  email: z.string().email({ message: "email is Invalid " }),

  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" }),
});

export type signupTypes = z.infer<typeof signUpValidator>;
