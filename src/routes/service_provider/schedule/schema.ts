import { z } from "zod";

export const createScheduleSchema = z.object({
	service_provider_id: z.string(),
	date: z.date(),
	start_at: z.string(),
	end_at: z.string()
});

export type CreateScheduleSchema = z.infer<typeof createScheduleSchema>;

export const updateScheduleSchema = z.object({
	id: z.string(),
	date: z.date(),
	start_at: z.string(),
	end_at: z.string(),
	disabled: z.boolean()
});

export type UpdateScheduleSchema = z.infer<typeof updateScheduleSchema>;

export const deleteScheduleSchema = z.object({
	id: z.string()
});

export type DeleteScheduleSchema = z.infer<typeof deleteScheduleSchema>;
