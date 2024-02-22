import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/lib/db/schema';
dotenv.config();
import { eq } from 'drizzle-orm';

export const client = createClient({
	url: process.env.DATABASE_URL as string,
	authToken: process.env.DATABASE_AUTH_TOKEN as string
});

export const db = drizzle(client, { schema });

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

async function main() {
	try {
		const users = await db.query.userTable.findMany();

		for (let index = 0; index < users.length; index++) {
			const user = users[index];
			const osteopath = await db.query.osteopathTable.findFirst({
				where: eq(schema.osteopathTable.userId, user.id)
			});
			if (!osteopath && user.role === 'osteopath') {
				console.log('ACCOUNT NOT FOUND FOR: ', user.name);

				const emailDetail = extractFromEmail(user.gmail);
				const { year, batch } = emailDetail;
				const { role, course } =
					batch === 'bos' || batch === 'mos' || batch === 'ios'
						? ({ role: 'osteopath', course: batch } as const)
						: ({ role: 'student', course: batch } as const);
				await db.insert(schema.osteopathTable).values({
					courseId: course,
					userId: user.id,
					batch: year,
					calendarId: null
				});
				console.log('ACCOUNT CREATED FOR: ', user.name);
			}
		}

		console.log('Tables migrated!');
		process.exit(0);
	} catch (error) {
		console.error('Error performing migration: ', error);
		process.exit(1);
	}
}

main();
