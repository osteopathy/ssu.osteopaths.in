import { db } from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { createUsername, deleteUsername, doesUsernameExist } from "$lib/server/kv";
import { eq, not } from "drizzle-orm";
import { feedbackTable, osteopathTable } from "$lib/db/schema";
import slugify from "$lib/utils/slugify";

export const load: PageServerLoad = async () => {
    return {
        osteopaths: db.query.osteopathTable.findMany({
            where: not(eq(osteopathTable.username,'vishnu')),
            with: {
                user: true,
                course: true
            }
        })
    }
};


// Global Actions
export const actions: Actions = {
    feedback: async (event) => {
        const formData = await event.request.formData()

        const content = formData.get('content')
        const category = formData.get('category')

        if (!event.locals.user?.id || !content || !category) {
            return fail(400, {
                message: 'failed'
            });
        }
        const userId = event.locals.user.id
        try {
            await db.insert(feedbackTable).values({
                userId,
                category: category.toString() as 'idea' | 'issue' | 'other',
                content: content.toString(),
            })
        } catch (error) {
            return fail(400, {
                message: error,
            })
        }
        return {};
    },
    'username': async (event) => {
        const formData = await event.request.formData()
        let username = formData.get('username')?.toString()

        if (!event.locals.user?.id || event.locals.user.role !== 'osteopath') {
            return fail(401, {
                message: 'unauthorized'
            });
        }

        if (!username) {
            return fail(400, {
                message: 'username undefined'
            });
        }

        username = slugify(username);

        const exist = await doesUsernameExist(username)

        if (exist) {
            return fail(409, {
                message: 'username already exist'
            });
        }

        const osteopath = await db.query.osteopathTable.findFirst({ where: eq(osteopathTable.userId, event.locals.user.id) })

        if (!osteopath) {
            return fail(400, {
                message: 'osteopath not found'
            });
        }


        const [res1, res2] = await Promise.allSettled([createUsername(username, osteopath.id, event.locals.user.id), db.update(osteopathTable).set({ username }).where(eq(osteopathTable.id, osteopath.id))])

        if (res1.status === 'rejected') {
            if (res2.status === 'fulfilled') await db.update(osteopathTable).set({ username: osteopath.username }).where(eq(osteopathTable.id, osteopath.id));

            return fail(500, {
                message: 'failed to create username'
            })
        } else if (res1.status === 'fulfilled' && res2.status === 'fulfilled') {
            try {
                if (osteopath.username) await deleteUsername(osteopath.username);
            } catch (error) {
                await Promise.all([db.update(osteopathTable).set({ username: osteopath.username }).where(eq(osteopathTable.id, osteopath.id)), deleteUsername(username)]);
                return fail(500, {
                    message: 'failed to delete old username'
                })
            }
            return {
                username
            }
        } else {
            if (res2.status === 'rejected') await deleteUsername(username);
            return fail(500, {
                message: 'failed to create username'
            })
        }
    },
};