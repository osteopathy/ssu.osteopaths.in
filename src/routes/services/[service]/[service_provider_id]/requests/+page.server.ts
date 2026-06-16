import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
	serviceProviderAppointmentRequestTable,
	serviceProviderAppointmentTable,
	serviceProviderDateWiseScheduleTable,
	WithDrawReasons
} from "$lib/database/schema";
import { db } from "$lib/database";
import { and, asc, eq, gte, not } from "drizzle-orm";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
	bookAppointmentSchema,
	createRequestSchema,
	scheduleSchema,
	unbookAppointmentSchema,
	updateRequestSchema,
	withdrawRequestSchema
} from "./schema";

export const load: PageServerLoad = async (event) => {
	const service_provider_id = event.params.service_provider_id;
	const dateschedule = await db.query.serviceProviderDateWiseScheduleTable.findMany({
		where: and(
			eq(serviceProviderDateWiseScheduleTable.serviceProviderId, service_provider_id),
			gte(serviceProviderDateWiseScheduleTable.date, new Date())
		),
		orderBy: [
			asc(serviceProviderDateWiseScheduleTable.date),
			asc(serviceProviderDateWiseScheduleTable.startAt)
		],
		with: {
			requests: {
				with: {
					user: true
				},
				where: and(
					not(eq(serviceProviderAppointmentRequestTable.status, "withdrawn")),
					not(eq(serviceProviderAppointmentRequestTable.status, "accepted"))
				)
			}
		}
	});
	const bookappointment = await superValidate(zod(bookAppointmentSchema));
	const scheduleForm = await superValidate(zod(scheduleSchema));
	return { dateschedule, bookappointment, scheduleForm };
};

export const actions: Actions = {
	newschedule: async (event) => {
		if (!event.locals.user) redirect(302, "/");
		const form = await superValidate(event.request, zod(scheduleSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const service_provider_id = event.params.service_provider_id;
		const result = await db.query.serviceProviderDateWiseScheduleTable.findFirst({
			where: and(
				eq(serviceProviderDateWiseScheduleTable.serviceProviderId, service_provider_id),
				eq(serviceProviderDateWiseScheduleTable.date, form.data.date)
			)
		});
		if (result) {
			await db
				.update(serviceProviderDateWiseScheduleTable)
				.set({
					startAt: form.data.start_at,
					endAt: form.data.end_at
				})
				.where(eq(serviceProviderDateWiseScheduleTable.id, result.id));
		} else {
			await db.insert(serviceProviderDateWiseScheduleTable).values({
				serviceProviderId: service_provider_id,
				date: form.data.date,
				startAt: form.data.start_at,
				endAt: form.data.end_at
			});
		}
		return message(form, "new schedule");
	},
	unbookappointment: async (event) => {
		if (!event.locals.user) redirect(302, "/");
		const form = await superValidate(event.request, zod(unbookAppointmentSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		await db.batch([
			db
				.delete(serviceProviderAppointmentTable)
				.where(eq(serviceProviderAppointmentTable.id, form.data.appointment_id)),
			db
				.update(serviceProviderAppointmentRequestTable)
				.set({
					status: "withdrawn",
					withdrawnReason: form.data.note ?? WithDrawReasons["UserCancelled"]
				})
				.where(eq(serviceProviderAppointmentRequestTable.id, form.data.appointment_request_id))
		]);
	},
	bookappointment: async (event) => {
		if (!event.locals.user) redirect(302, "/");
		const form = await superValidate(event.request, zod(bookAppointmentSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const service_provider_id = event.params.service_provider_id;
		await db.batch([
			db.insert(serviceProviderAppointmentTable).values({
				appointmentRequestId: form.data.appointment_request_id,
				serviceProviderId: service_provider_id,
				userId: form.data.user_id,
				startAt: form.data.start_at,
				endAt: form.data.end_at,
				date: form.data.date
			}),
			db
				.update(serviceProviderAppointmentRequestTable)
				.set({
					status: "accepted"
				})
				.where(eq(serviceProviderAppointmentRequestTable.id, form.data.appointment_request_id))
		]);
	},
	create: async (event) => {
		if (!event.locals.user) redirect(302, "/");
		const form = await superValidate(event.request, zod(createRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const service_provider_id = form.data.service_provider_id ?? event.params.service_provider_id;
		await db.insert(serviceProviderAppointmentRequestTable).values({
			userId: event.locals.user.id,
			serviceProviderId: service_provider_id,
			date: form.data.date,
			startAt: form.data.start_at,
			endAt: form.data.end_at,
			dateWiseScheduleId: form.data.date_wise_schedule_id,
			note: form.data.note,
			status: "idle"
		});
		return message(form, "your request is sent!");
	},
	update: async (event) => {
		if (!event.locals.user) redirect(302, "/");
		const form = await superValidate(event.request, zod(updateRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const service_provider_id = form.data.service_provider_id ?? event.params.service_provider_id;
		await db
			.update(serviceProviderAppointmentRequestTable)
			.set({
				userId: event.locals.user.id,
				serviceProviderId: service_provider_id,
				date: form.data.date,
				startAt: form.data.start_at,
				endAt: form.data.end_at,
				dateWiseScheduleId: form.data.date_wise_schedule_id,
				note: form.data.note,
				status: "idle"
			})
			.where(eq(serviceProviderAppointmentRequestTable.id, form.data.appointment_request_id));
		return message(form, "timings are updated");
	},
	withdraw: async (event) => {
		if (!event.locals.user) redirect(302, "/");
		const form = await superValidate(event.request, zod(withdrawRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		await db
			.update(serviceProviderAppointmentRequestTable)
			.set({
				status: "withdrawn",
				withdrawnReason: WithDrawReasons["unknown"]
			})
			.where(eq(serviceProviderAppointmentRequestTable.id, form.data.appointment_request_id));
		return message(form, "your request is withdrawn");
	}
};
