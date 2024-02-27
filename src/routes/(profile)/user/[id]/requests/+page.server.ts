import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { and, asc, eq, gte } from 'drizzle-orm';
import { appointmentTable } from '$lib/db/schema';
import groupBy from 'just-group-by';
import { Temporal } from 'temporal-polyfill';

export const load: PageServerLoad = async (event) => {
	const from = Temporal.Now.plainDateISO();
    if(!(event.locals.user?.id === event.params.id)) redirect(308,'/');
	const appointments = await db.query.appointmentTable.findMany({
		where: and(
			eq(appointmentTable.userId, event.locals.user.id),
			gte(appointmentTable.date, from.toString())
		),
		with: {
			osteopath: {
				with: {
					user: true
				}
			}
		},
		orderBy: [asc(appointmentTable.startTime), asc(appointmentTable.date)]
	});

	return {
		appointments: groupBy(appointments, (appointment) => appointment.date as string)
	};
};
