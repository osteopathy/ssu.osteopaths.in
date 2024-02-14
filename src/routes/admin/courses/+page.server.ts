import { courseTable, createCourseSchema } from '$lib/db/schema';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	return {
		courses: await db.query.courseTable.findMany(),
		form: await superValidate(createCourseSchema)
	};
};

export const actions: Actions = {
	'create-course': async (event) => {
		const form = await superValidate(event, createCourseSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const course = form.data;
		try {
			await db.insert(courseTable).values(course);
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
	'update-course': async (event) => {
		const form = await superValidate(event, createCourseSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const course = form.data;
		try {
			await db.update(courseTable).set(course).where(eq(courseTable.id, course.id));
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
