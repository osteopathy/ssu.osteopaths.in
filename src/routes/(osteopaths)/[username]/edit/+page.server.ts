import type { Actions, PageServerLoad } from './$types';
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from './schema';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { createUserSchema, osteopathTable, type Calendar, calendarTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load:PageServerLoad = (async (e) => {
    const result = await e.parent()
    let calendar: Calendar | undefined;
    if (result.osteopath?.calendarId) {
		calendar = await db.query.calendarTable.findFirst({
			where: eq(calendarTable.id, result.osteopath?.calendarId)
		});
	}
    return {
        userForm: await superValidate(zod(createUserSchema.default({
            name: result.user?.name,
            phoneNumber: result.user?.phoneNumber,
        }))),
        osteopathForm: await superValidate(zod(formSchema.default({
            about: result.osteopath?.about,
            session_daily_limit: result.osteopath.session?.daily_limit,
            session_location: result.osteopath.session?.location,
        }))),
        calendar
    };
});

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		if (!event.locals.user?.id) {
			return fail(400, {
				form
			});
		}

		const osteopath = form.data;

		try {
			await db
				.update(osteopathTable)
				.set({
					about: osteopath.about,
					session: {
						location: osteopath.session_location,
						daily_limit: +`${osteopath.session_daily_limit}`
					}
				})
				.where(eq(osteopathTable.userId, event.locals.user.id));
		} catch (error) {
			return fail(400, {
				message: error,
				form
			});
		}

		return {
			form
		};
	}
};
