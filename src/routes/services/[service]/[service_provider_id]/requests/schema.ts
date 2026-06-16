import { z } from "zod";

export const scheduleSchema = z.object({
	date: z.date(),
	start_at: z.string(),
	end_at: z.string()
});

export type scheduleSchema = z.infer<typeof scheduleSchema>;

export const unbookAppointmentSchema = z.object({
	appointment_id: z.string(),
	appointment_request_id: z.string(),
	note: z.string().min(10, "write more!")
});

export type UnBookAppointmentSchema = z.infer<typeof unbookAppointmentSchema>;

export const bookAppointmentSchema = z.object({
	appointment_request_id: z.string(),
	user_id: z.string(),
	date: z.date(),
	start_at: z.string(),
	end_at: z.string()
});

export type BookAppointmentSchema = z.infer<typeof bookAppointmentSchema>;

export const createRequestSchema = z.object({
	service_provider_id: z.string().nullable(),
	date_wise_schedule_id: z.string(),
	date: z.date(),
	start_at: z.string(),
	end_at: z.string(),
	note: z.string().nullable()
});

export type CreateRequestSchema = z.infer<typeof createRequestSchema>;

export const updateRequestSchema = z.object({
	service_provider_id: z.string().nullable(),
	appointment_request_id: z.string(),
	date_wise_schedule_id: z.string(),
	date: z.date(),
	start_at: z.string(),
	end_at: z.string(),
	note: z.string().nullable()
});

export type UpdateRequestSchema = z.infer<typeof updateRequestSchema>;

export const withdrawRequestSchema = z.object({
	appointment_request_id: z.string()
});

export type WithDrawRequestSchema = z.infer<typeof withdrawRequestSchema>;
