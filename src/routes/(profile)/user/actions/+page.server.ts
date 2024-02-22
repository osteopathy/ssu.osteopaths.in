import { createUserSchema, userTable } from "$lib/db/schema";
import { db } from "$lib/server/db";
import { fail, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const actions: Actions = {
	'update-user': async (event) => {
		const form = await superValidate(event, zod(createUserSchema));
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}
		
		if (!event.locals.user) {
			return fail(400, {
				form
			});
		}

		const removeNullUndefined = <T extends Object>(obj: T) => Object.entries(obj).reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {});
		const user = removeNullUndefined(form.data);
		
		try {
			await db.update(userTable).set(user).where(eq(userTable.id, event.locals.user.id));
		} catch (error) {
			return fail(404, {
				message: error,
				form
			});
		}

		return {
			form
		};
	},
};