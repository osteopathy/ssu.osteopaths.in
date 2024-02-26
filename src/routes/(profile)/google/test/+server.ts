import { generateId } from 'lucia';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { osteopathTable, userTable } from '$lib/db/schema';
import { json } from '@sveltejs/kit';

function extractFromEmail(email_id: string | undefined | null) {
	let group;
	if (!(typeof email_id === 'string')) return;
	const regrex = /(?<name>\w+)\.(?<meta>\w+)@(?<university>\w+)\.edu\.in/;
	group = email_id.match(regrex)?.groups;
	if (!group) return;
	const { name, meta } = group;
	const reg = /(?:[a-zA-Z])+(?<year>\d{4})(?<batch>(?:[a-zA-Z])+)/;
	group = meta.match(reg)?.groups;
	if (!group) return;
	const { year, batch } = group;
	return { name, meta, year, batch };
}

export const GET: RequestHandler = async (event) => {
	const payload = {
		email: 'sejal.k2023mos@srisriuniversity.edu.in',
		name: 'Sejal Shivdas Kadam',
		picture:
			'https://lh3.googleusercontent.com/a/ACg8ocKdVgo0T4M7xTsdLtLOC5_839lPb8kvjhaYFaddWg2J=s96-c'
	};
	const userId = generateId(15);
	const emailDetail = extractFromEmail(payload.email);
	let r;
	if (emailDetail) {
		const { year, batch } = emailDetail;
		const { role, course } =
			batch === 'bos' || batch === 'mos' || batch === 'ios'
				? ({ role: 'osteopath', course: batch } as const)
				: ({ role: 'student', course: batch } as const);
		r = role;
		let calendarId: string | null = null;
		await db.insert(userTable).values({
			id: userId,
			gmail: payload.email,
			image: payload.picture,
			name: payload.name,
			role
		});
		await db.insert(osteopathTable).values({
			courseId: course as 'mos',
			userId,
			batch: year
		});
	} else {
		await db.insert(userTable).values({
			id: userId,
			gmail: payload.email,
			image: payload.picture,
			name: payload.name,
			role: 'user'
		});
	}
	return json({
		userId,
		role: r
	});
};
