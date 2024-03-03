import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createUserSchema, osteopathTable } from '$lib/db/sqlite/schema';
import { db } from '$lib/db/sqlite';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(308, '/');

	const isCurrentUser = event.params.id === event.locals.user.id;

	if (!isCurrentUser) redirect(308, `/user/${event.params.id}`);

	if (event.locals.user.role === 'osteopath') {
		const osteopath = await db.query.osteopathTable.findFirst({
			where: eq(osteopathTable.userId, event.locals.user.id),
			columns: {
				username: true
			}
		});
		redirect(307, `/${osteopath?.username}/edit`);
	}
	return {
		isCurrentUser,
		user: event.locals.user,
		form: await superValidate(zod(createUserSchema.default({
			name: event.locals.user.name,
			phoneNumber: event.locals.user.phoneNumber,
		}))),
		username: null
	};
};