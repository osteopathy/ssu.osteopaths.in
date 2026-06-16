import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/database";
import { and, asc, count, eq, gte, not } from "drizzle-orm";
import {
	serviceProviderAppointmentRequestTable,
	serviceProviderAppointmentTable,
	serviceProviderDateWiseScheduleTable,
	serviceProviderTable,
	serviceSubscriptionTable
} from "$lib/database/schema";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
	createScheduleSchema,
	deleteScheduleSchema,
	updateScheduleSchema
} from "../../../service_provider/schedule/schema";
import { acceptRequestSchema } from "../../../service_provider/request/schema";

// appointments/ requests/ feedbacks/ subscribers/ work schedule
export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/");
	if (event.locals?.user?.role !== "service_provider") redirect(302, `/${event.locals.user.id}`);
	console.log(event.locals.user);
	const serviceProvider = await db.query.serviceProviderTable.findFirst({
		where: eq(serviceProviderTable.userId, event.locals.user.id),
		with: {
			dateWiseScheduleList: {
				where: gte(serviceProviderDateWiseScheduleTable.date, new Date()),
				orderBy: [
					asc(serviceProviderDateWiseScheduleTable.date),
					asc(serviceProviderDateWiseScheduleTable.startAt)
				],
				with: {
					requests: {
						where: and(
							not(eq(serviceProviderAppointmentRequestTable.status, "withdrawn")),
							not(eq(serviceProviderAppointmentRequestTable.status, "accepted"))
						),
						orderBy: [
							asc(serviceProviderAppointmentRequestTable.createdAt),
							asc(serviceProviderAppointmentRequestTable.status)
						],
						with: {
							user: true
						}
					}
				}
			},
			appointments: {
				where: gte(serviceProviderAppointmentTable.date, new Date()),
				orderBy: [
					asc(serviceProviderAppointmentTable.date),
					asc(serviceProviderAppointmentTable.startAt)
				],
				with: {
					user: true
				}
			}
		}
	});
	console.log(serviceProvider);
	return {
		subscriptionCount: db
			.select({ count: count() })
			.from(serviceSubscriptionTable)
			.where(eq(serviceSubscriptionTable.userId, event.locals.user.id))
			.then((data) => data[0].count),
		serviceProvider,
		scheduleForms: {
			create: await superValidate(zod(createScheduleSchema)),
			update: await superValidate(zod(updateScheduleSchema)),
			delete: await superValidate(zod(deleteScheduleSchema))
		},
		requestForms: {
			accept: await superValidate(zod(acceptRequestSchema))
		}
	};
};
