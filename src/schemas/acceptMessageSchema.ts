import { z } from "zod";

export const acceptingMessage = z.object({ AcceptingMessage: z.boolean() });
