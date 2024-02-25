import { getUserIdByUsername } from "$lib/server/kv";
import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { osteopathTable, userTable } from "$lib/db/schema";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";

// Definition of the layout
// This file is used to fetch the details of osteopath from there [username]
export const load: LayoutServerLoad = async (event) => {
    const userId = await getUserIdByUsername(event.params.username);
    
    if (!userId)
        error(404, {
            message: 'Username Not found'
        });

    if (userId === event.locals.user?.id) {
        const osteopath = await db.query.osteopathTable.findFirst({
            where: eq(osteopathTable.userId, userId),
        })
        return {
            isCurrentUser: true,
            osteopath: {
                user: event.locals.user,
                ...osteopath
            }
        }
    }
    const res = (
        await db
            .select()
            .from(userTable)
            .where(eq(userTable.id, userId))
            .leftJoin(osteopathTable, eq(userTable.id, osteopathTable.userId)))[0]

    if (!res?.osteopath) return error(404, { message: 'Osteopath Not found' });

    return {
        isCurrentUser: false,
        osteopath: {
            user: res.user,
            ...res.osteopath
        }
    }
};