import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { superValidate, fail, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { acceptRequestSchema } from "./schema";
import { db } from "$lib/database";
import {
	serviceProviderAppointmentRequestTable,
	serviceProviderAppointmentTable
} from "$lib/database/schema";
import { eq } from "drizzle-orm";

export const actions: Actions = {
	accept: async (event) => {
		if (!event.locals.user) redirect(302, "/");
		const form = await superValidate(event.request, zod(acceptRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			await db.batch([
				db.insert(serviceProviderAppointmentTable).values({
					appointmentRequestId: form.data.id,
					serviceProviderId: form.data.service_provider_id,
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
					.where(eq(serviceProviderAppointmentRequestTable.id, form.data.id))
			]);
		} catch (error) {
			return fail(500, { message: "Failed to accept request: " + error });
		}
		return message(form, "Accepted Request");
	}
};
