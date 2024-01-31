import { db } from "$lib/server/db";
import { getUserIdByUsername } from "$lib/server/kv";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { osteopathTable, userTable } from "$lib/db/schema";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    const userId = await getUserIdByUsername(event.params.username)

    if (!userId) error(404, {
        message: 'Username Not found',
    });
    
    if (userId === event.locals.user?.id) {
        const osteopath = await db.query.osteopathTable.findFirst({
            where: eq(osteopathTable.userId, userId),
            with: {
                course: true
            }
        })
        return {
            isCurrentUser: true,
            user: event.locals.user,
            osteopath,
        }
    }
    const res = (await db.select().from(userTable).where(eq(userTable.id,userId)).leftJoin(osteopathTable,eq(userTable.id,osteopathTable.userId)))[0];
    return {
        isCurrentUser: false,
        ...res
    }
};