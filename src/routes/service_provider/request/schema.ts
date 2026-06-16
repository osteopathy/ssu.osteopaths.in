import { z } from "zod";

export const acceptRequestSchema = z.object({
	id: z.string(),
	service_provider_id: z.string(),
	user_id: z.string(),
	start_at: z.string(),
	end_at: z.string(),
	date: z.date()
});

export type AcceptRequestSchema = z.infer<typeof acceptRequestSchema>;

export const rejectRequestSchema = z.object({
	id: z.string()
});

export type RejectRequestSchema = z.infer<typeof rejectRequestSchema>;
