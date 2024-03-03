import { error, json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { appointmentTable, type Appointment, type InsertAppointment } from '$lib/db/sqlite/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async (event) => {
	const appointment = await event.request.json() as InsertAppointment;

	const res = (
		await db
			.insert(appointmentTable)
			.values(appointment)
			.returning()
	)[0];
	
	return json({ data: res });
};


export const PUT: RequestHandler = async (event) => {
	const id = event.url.searchParams.get('id')

	if(id === null) return error(404,{ message: 'APPOINTMENT ID NULL' });

	const appointment = await event.request.json() as Partial<Omit<Appointment, 'id'>>;

	const res = (
		await db.update(appointmentTable).set(appointment).where(eq(appointmentTable.id, id)).returning()
	)[0];
	
	return json({ data: res });
};

export const DELETE: RequestHandler = async (event) => {
	const id = event.url.searchParams.get('id')
	
	if(id === null) return error(404,{ message: 'APPOINTMENT ID NULL' });

	const res = (
		await db.delete(appointmentTable).where(eq(appointmentTable.id, id)).returning()
	)[0];
	
	return json({ data: res });
};