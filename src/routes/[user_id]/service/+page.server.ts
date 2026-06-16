import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/database";
import { and, asc, eq, gte, inArray, not } from "drizzle-orm";
import {
	serviceProviderAppointmentRequestTable,
	serviceProviderAppointmentTable,
	serviceProviderDateWiseScheduleTable,
	serviceSubscriptionTable
} from "$lib/database/schema";
import {
	createRequestSchema,
	unbookAppointmentSchema,
	updateRequestSchema,
	withdrawRequestSchema
} from "../../services/[service]/[service_provider_id]/requests/schema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/");
	// fetch subscriptions
	const appointmentRequests = await db.query.serviceProviderAppointmentRequestTable.findMany({
		where: and(
			not(eq(serviceProviderAppointmentRequestTable.status, "withdrawn")),
			eq(serviceProviderAppointmentRequestTable.userId, event.locals.user.id),
			gte(serviceProviderAppointmentRequestTable.date, new Date())
		),
		orderBy: [
			asc(serviceProviderAppointmentRequestTable.date),
			asc(serviceProviderAppointmentRequestTable.startAt)
		],
		with: {
			dateWiseSchedule: true,
			serviceProvider: {
				with: {
					user: true
				}
			}
		}
	});
	// list of service-providers to whom user already sent a request,
	const serviceProviderIds = appointmentRequests
		.map((req) => req.serviceProviderId)
		.filter(Boolean) as string[];

	const subscriptions = await db.query.serviceSubscriptionTable.findMany({
		where: eq(serviceSubscriptionTable.userId, event.locals.user.id),
		with: {
			serviceProvider: {
				with: {
					user: true,
					dateWiseScheduleList: {
						// don't fetch Date Wise Schedule List, for requests being sent
						where: and(
							not(
								inArray(serviceProviderDateWiseScheduleTable.serviceProviderId, serviceProviderIds)
							),
							gte(serviceProviderDateWiseScheduleTable.date, new Date())
						),
						orderBy: [
							asc(serviceProviderDateWiseScheduleTable.date),
							asc(serviceProviderDateWiseScheduleTable.startAt)
						]
					}
				}
			}
		}
	});

	const appointmentrequest = appointmentRequests.find((e) => e.status === "accepted");

	const appointments = appointmentrequest
		? await db.query.serviceProviderAppointmentTable.findMany({
				where: and(
					eq(serviceProviderAppointmentTable.userId, event.locals.user.id),
					gte(serviceProviderAppointmentTable.date, new Date())
				),
				orderBy: [
					asc(serviceProviderAppointmentTable.date),
					asc(serviceProviderAppointmentTable.startAt)
				],
				limit: 1,
				with: {
					serviceProvider: {
						with: {
							user: true
						}
					}
				}
			})
		: [];

	const create = await superValidate(zod(createRequestSchema));
	const update = await superValidate(zod(updateRequestSchema));
	const withdraw = await superValidate(zod(withdrawRequestSchema));
	const unbookappointment = await superValidate(zod(unbookAppointmentSchema));

	return {
		subscriptions: subscriptions,
		appointmentRequests: appointmentRequests,
		appointments,
		unbookappointment,
		requestforms: {
			create,
			update,
			withdraw
		}
	};
};
