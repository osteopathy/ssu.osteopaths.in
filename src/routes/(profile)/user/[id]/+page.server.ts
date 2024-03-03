import { db } from '$lib/db/sqlite';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { userTable } from '$lib/db/sqlite/schema';

export const load: PageServerLoad = async (event) => {
	const isCurrentUser = event.params.id === event.locals.user?.id;
	if (isCurrentUser) {
		return {
			isCurrentUser,
			user: event.locals.user
		};
	}
	const user = await db.query.userTable.findFirst({ where: eq(userTable.id, event.params.id) });
	return {
		isCurrentUser,
		user
	};
};
