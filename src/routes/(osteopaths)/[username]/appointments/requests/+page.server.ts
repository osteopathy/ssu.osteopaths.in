import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { osteopathTable } from "$lib/db/schema";

export const load: PageServerLoad = async (event) => {
    if(!event.locals.user) redirect(307,'/');
    const appointments = await db.query.appointmentTable.findMany({
        where: eq(osteopathTable.userId, event.locals.user.id),
    })
    event.locals.user.id
    return {
    }
};