import { db } from "$lib/database/index.js";
import { userTable } from "$lib/database/schema/index.js";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { syncCurrentUser } from "../../(api)/api/v1/refresh/helpers";

const schema = z.object({
	name: z.string().nullable(),
	phone: z.string().nullable()
});

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/");
	const pageuser =
		event.locals.user.id === event.params.user_id
			? event.locals.user
			: await db.query.userTable.findFirst({
					where: eq(userTable.id, event.params.user_id)
				});
	const form = await superValidate({ name: pageuser?.name, phone: pageuser?.phone }, zod(schema));
	return { form, pageuser };
};

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.user) return fail(401, { message: "Unauthorized" });

		const form = await superValidate(event.request, zod(schema));

		if (!form.valid) {
			return fail(400, { form });
		}

		await db
			.update(userTable)
			.set({
				name: form.data.name,
				phone: form.data.phone
			})
			.where(eq(userTable.id, event.locals.user?.id));
		await syncCurrentUser(event);
		return message(form, "Form posted successfully!");
	}
};
