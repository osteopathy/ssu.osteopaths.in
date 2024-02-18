import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { calendarTable, osteopathTable, type Calendar } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	const data = await event.parent();
	let calendar: Calendar | undefined;

	if (data.osteopath?.calendarId) {
		calendar = await db.query.calendarTable.findFirst({
			where: eq(calendarTable.id, data.osteopath?.calendarId)
		});
	}

	return {
		form: await superValidate(formSchema),
		calendar
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, formSchema);

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
						duration: +`${osteopath.session_duration}`,
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
