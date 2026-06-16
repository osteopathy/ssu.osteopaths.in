import { message, superValidate } from "sveltekit-superforms";
import type { Actions } from "./$types";
import { serviceProviderDateWiseScheduleTable } from "$lib/database/schema";
import { db } from "$lib/database";
import { fail, redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { eq } from "drizzle-orm";
import { createScheduleSchema, deleteScheduleSchema, updateScheduleSchema } from "./schema";

export const actions: Actions = {
	create: async (event) => {
		if (!event.locals.user) redirect(302, "/");

		const form = await superValidate(event.request, zod(createScheduleSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			console.log("[Schedule] Creating new schedule:", form.data);
			await db.insert(serviceProviderDateWiseScheduleTable).values({
				serviceProviderId: form.data.service_provider_id,
				date: form.data.date,
				startAt: form.data.start_at,
				endAt: form.data.end_at
			});
		} catch (error) {
			console.error("[Schedule] Failed to create schedule:", error);
			return fail(400, { form, error: "A schedule for this date already exists." });
		}
		return message(form, "new schedule");
	},
	update: async (event) => {
		if (!event.locals.user) redirect(302, "/");
		const form = await superValidate(event.request, zod(updateScheduleSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		await db
			.update(serviceProviderDateWiseScheduleTable)
			.set({
				date: form.data.date,
				startAt: form.data.start_at,
				endAt: form.data.end_at,
				disabled: form.data.disabled
			})
			.where(eq(serviceProviderDateWiseScheduleTable.id, form.data.id));
		return message(form, "updated schedule");
	},
	delete: async (event) => {
		if (!event.locals.user) redirect(302, "/");
		const form = await superValidate(event.request, zod(deleteScheduleSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		await db
			.delete(serviceProviderDateWiseScheduleTable)
			.where(eq(serviceProviderDateWiseScheduleTable.id, form.data.id));
		return message(form, "deleted schedule");
	}
};
