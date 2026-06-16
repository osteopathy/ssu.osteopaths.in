import { db } from "$lib/database";
import { and, asc, eq, gte, not } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import {
	serviceProviderAppointmentRequestTable,
	serviceProviderAppointmentTable,
	serviceProviderDateWiseScheduleTable,
	serviceProviderTable,
	serviceSubscriptionTable
} from "$lib/database/schema";
import { redirect } from "@sveltejs/kit";
import {
	createRequestSchema,
	unbookAppointmentSchema,
	updateRequestSchema,
	withdrawRequestSchema
} from "./requests/schema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/");

	// fetching appointment request of the current logged in user from database
	// exclusing appointment request with withdrawn status
	// fetching only upcoming appointment request
	// alongside the datewiseschedule they are associated with already
	const appointmentRequest = await db.query.serviceProviderAppointmentRequestTable.findFirst({
		where: and(
			not(eq(serviceProviderAppointmentRequestTable.status, "withdrawn")),
			eq(serviceProviderAppointmentRequestTable.userId, event.locals.user.id),
			gte(serviceProviderAppointmentRequestTable.date, new Date()),
			eq(serviceProviderAppointmentRequestTable.serviceProviderId, event.params.service_provider_id)
		),
		orderBy: [
			asc(serviceProviderAppointmentRequestTable.date),
			asc(serviceProviderAppointmentRequestTable.startAt)
		],
		with: {
			dateWiseSchedule: true
		}
	});

	const serviceProvider = await db.query.serviceProviderTable.findFirst({
		where: eq(serviceProviderTable.id, event.params.service_provider_id),
		with: {
			user: true,
			// if there appointment Request already accepted then fetch current service provider appointments with the user
			...(appointmentRequest?.status === "accepted" &&
				appointmentRequest && {
					appointments: {
						where: and(
							eq(serviceProviderAppointmentTable.userId, event.locals.user.id),
							gte(serviceProviderAppointmentTable.date, new Date())
						),
						orderBy: [
							asc(serviceProviderAppointmentTable.date),
							asc(serviceProviderAppointmentTable.startAt)
						],
						limit: 1
					}
				}),
			// if there appointment Request already sent from the user don't fetch current service provider schedule
			...(!appointmentRequest && {
				dateWiseScheduleList: {
					where: gte(serviceProviderDateWiseScheduleTable.date, new Date()),
					orderBy: [
						asc(serviceProviderDateWiseScheduleTable.date),
						asc(serviceProviderDateWiseScheduleTable.startAt)
					]
				}
			}),
			subscriptions: {
				where: eq(serviceSubscriptionTable.userId, event.locals.user.id),
				limit: 1
			}
		}
	});

	const create = await superValidate(zod(createRequestSchema));
	const update = await superValidate(zod(updateRequestSchema));
	const withdraw = await superValidate(zod(withdrawRequestSchema));
	const unbookappointment = await superValidate(zod(unbookAppointmentSchema));

	return {
		serviceProvider,
		isSubscribed: (serviceProvider?.subscriptions ?? []).length > 0,
		appointmentRequests: appointmentRequest?.status === "idle" ? [appointmentRequest] : undefined,
		unbookappointment,
		requestforms: {
			create,
			update,
			withdraw
		}
	};
};
