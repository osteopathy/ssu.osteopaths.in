import { z } from "zod";

export const formSchema = z.object({
  about: z.string(),
  session_location: z.string(),
  session_duration: z.string().transform((val) => parseInt(val)),
  session_daily_limit: z.string().transform((val) => parseInt(val)),
});

export type FormSchema = typeof formSchema;