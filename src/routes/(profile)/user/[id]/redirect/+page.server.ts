import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { osteopathTable } from "$lib/db/schema";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (e) => {
    if (e.locals.user === null) return redirect(307, '/');

    if (e.locals.user.role === 'osteopath') {
        const osteopath = await db.query.osteopathTable.findFirst({
            where: eq(osteopathTable.userId, e.locals.user.id),
            columns: {
                username: true
            }
        });
        redirect(307, `/${osteopath?.username}`);
    }
}
