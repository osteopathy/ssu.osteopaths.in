import { z } from 'zod';

export const formSchema = z.object({
	about: z.string(),
	session_location: z.string(),
	session_duration: z.string(),
	session_daily_limit: z.string()
});

export type FormSchema = typeof formSchema;
