import { generateId } from "lucia";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { osteopathTable, userTable } from "$lib/db/schema";

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
    const userId = generateId(15);
    const emailDetail = extractFromEmail('rishi.s2022mos@srisriuniversity.edu.in');
    let r;
    if (emailDetail) {
        const { year, batch } = emailDetail;
        const { role, course } =
            batch === 'bos' || batch === 'mos' || batch === 'ios'
                ? ({ role: 'osteopath', course: batch } as const)
                : ({ role: 'student', course: batch } as const);
        r = role;
        let calendarId: string | null = null;
        const settled = await Promise.allSettled([
            db.insert(userTable).values({
                id: userId,
                gmail: 'rishi.s2022mos@srisriuniversity.edu.in',
                image: null,
                name: 'DR. RISHI RAJ SINGH',
                role
            }),
            role === 'osteopath' &&
            db.insert(osteopathTable).values({
                courseId: course,
                userId,
                batch: year,
                calendarId
            })
        ]);
        if (settled[0].status === 'rejected') {
            console.log("FAILED TO INSERT USER");
        }
        if (settled[1].status === 'rejected') {
            console.log("FAILED TO INSERT OSTEOPATH");
        }
    } else {
        await db.insert(userTable).values({
            id: userId,
            gmail: payload.email,
            image: payload.picture,
            name: payload.name,
            role: 'user'
        });

        return new Response();
    };