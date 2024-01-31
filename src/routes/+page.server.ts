import { db } from "$lib/server/db";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    return {
        osteopaths: db.query.osteopathTable.findMany({
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
        formData.forEach((value, key) => {
            console.log(key, value)
        })
        if (!event.locals.user?.id) {
            return fail(400, {
                message: 'failed'
            });
        }

        try {
        } catch (error) {
            return fail(400, {
                message: error,
            })
        }
        return {};
    }
};