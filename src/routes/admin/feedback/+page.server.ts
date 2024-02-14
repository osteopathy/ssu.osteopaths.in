import { feedbackTable, createFeedbackSchema } from '$lib/db/schema';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { db } from '$lib/server/db';
import { asc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	return {
		feedbacks: await db.query.feedbackTable.findMany({
			orderBy: asc(feedbackTable.createdAt),
			with: {
				user: true
			}
		}),
		form: await superValidate(createFeedbackSchema)
	};
};

export const actions: Actions = {
	'create-feedback': async (event) => {
		console.log('RUNNING CREATE FEEDBACK');
		const form = await superValidate(event, createFeedbackSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const feedback = form.data;
		console.log(feedback);
		try {
			await db.insert(feedbackTable).values(feedback);
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
	'update-feedback': async (event) => {
		const form = await superValidate(event, createFeedbackSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const feedback = form.data;

		if (!feedback.id) return fail(400, { form });

		try {
			await db.update(feedbackTable).set(feedback).where(eq(feedbackTable.id, feedback.id));
		} catch (error) {
			return fail(404, {
				message: error,
				form
			});
		}
		return {
			form
		};
	}
};
