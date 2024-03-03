import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { and, asc, eq, gte } from 'drizzle-orm';
import { appointmentTable } from '$lib/db/sqlite/schema';
import groupBy from 'just-group-by';
import { Temporal } from 'temporal-polyfill';

export const load: PageServerLoad = async (event) => {
	const { osteopath } = await event.parent();
	if (!osteopath?.id) redirect(307, `/${event.params.username}`);
	const from = Temporal.Now.plainDateISO();

	const appointments = await db.query.appointmentTable.findMany({
		where: and(
			eq(appointmentTable.osteopathId, osteopath.id),
			gte(appointmentTable.date, from.toString())
		),
		with: {
			user: true
		},
		orderBy: [asc(appointmentTable.startTime), asc(appointmentTable.date)]
	});

	return {
		appointments: groupBy(appointments, (appointment) => appointment.date as string)
	};
};
