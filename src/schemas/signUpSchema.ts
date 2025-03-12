import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 Character")
  .max(20, "Username must be no more than 20 Character")
  .regex(/^[a-zA-Z0-9]+$/, "username must not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" }),
});
