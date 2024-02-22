import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { appointmentTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const POST = (async ({ request, locals }) => {
	if (!locals?.user)
		return new Response(null, {
			status: 400
		});
	const { osteopathId, duration, startTime, date } = await request.json();
	const res = (
		await db
			.insert(appointmentTable)
			.values({
				osteopathId,
				date,
				duration,
				startTime
			})
			.returning()
	)[0];
	return new Response(JSON.stringify({ message: 'CREATED', data: res }));
}) satisfies RequestHandler;

export const PATCH = (async (event) => {
	if (!event.locals?.user)
		return new Response(null, {
			status: 400
		});
	const { appointmentId, ...values } = await event.request.json();
	const res = (
		await db
			.update(appointmentTable)
			.set(values)
			.where(eq(appointmentTable.id, appointmentId))
			.returning()
	)[0];
	return new Response(JSON.stringify({ message: 'UPDATED', data: res }));
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
	if (!locals?.user)
		return new Response(null, {
			status: 400
		});
	const { appointmentId } = await request.json();
	const res = (
		await db.delete(appointmentTable).where(eq(appointmentTable.id, appointmentId)).returning()
	)[0];
	return new Response(JSON.stringify({ message: 'DELETED', data: res }));
}) satisfies RequestHandler;
