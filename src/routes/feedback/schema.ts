import { z } from "zod";

export const formSchema = z.object({
  about: z.string()
});

export type FormSchema = typeof formSchema;