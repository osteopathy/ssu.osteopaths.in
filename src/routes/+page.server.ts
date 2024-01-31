import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

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