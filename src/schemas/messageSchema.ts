import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must me at least 10 character " })
    .max(10, { message: "Content must me no longer then 300 characters " }),
});
