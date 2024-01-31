import { db } from '$lib/server/db';
import { Temporal } from 'temporal-polyfill';
import { and, asc, gte, isNotNull, eq } from 'drizzle-orm';
import { appointmentTable } from '$lib/db/schema';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const data = await event.parent();
	if(!data.osteopath?.id) redirect(308,`/${event.params.username}`)
	const today = Temporal.Now.plainDateISO().toLocaleString('en', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	const [month, day, year] = today.split('/');
	const t = `${year}-${month}-${day}`;
	console.log(data)
	return {
		appointments: db.query.appointmentTable.findMany({
			with: {
				user: true
			},
			where: and(
				// isNotNull(appointmentTable.userId),
				gte(appointmentTable.date, t),
				eq(appointmentTable.osteopathId,data.osteopath.id)
			),
			orderBy: asc(appointmentTable.date)
		}).execute()
	};
};
