import { z } from 'zod';

export const formSchema = z.object({
	about: z.string(),
	session_location: z.string(),
	session_daily_limit: z.number()
});

export type FormSchema = typeof formSchema;
