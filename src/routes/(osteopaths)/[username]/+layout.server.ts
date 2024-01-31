import { db } from "$lib/server/db";
import { getUserIdByUsername } from "$lib/server/kv";
import { eq } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";
import { courseTable, osteopathTable, userTable } from "$lib/db/schema";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event) => {
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
    const res = (await db.select().from(userTable).where(eq(userTable.id,userId)).leftJoin(osteopathTable,eq(userTable.id,osteopathTable.userId)).leftJoin(courseTable,eq(courseTable.id,osteopathTable.courseId)))[0];
    return {
        isCurrentUser: false,
        user: res.user,
        osteopath: {
            ...res.osteopath,
            course: res.course
        }
    }
};