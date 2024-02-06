import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { createUserSchema, osteopathTable } from "$lib/db/schema";
import { db } from "$lib/db";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
    if(!event.locals.user) redirect(308,'/');
    
    const isCurrentUser = event.params.id === event.locals.user.id;
    
    if(!isCurrentUser) redirect(308,`/user/${event.params.id}`)
    
    if(event.locals.user.role === 'osteopath') {
        const osteopath = await db.query.osteopathTable.findFirst({
            where: eq(osteopathTable.userId,event.locals.user.id),
            columns: {
                username: true,
            }
        })
        return {
            isCurrentUser,
            user: event.locals.user,
            form: await superValidate(createUserSchema),
            username: osteopath?.username
        };
    }
    return {
        isCurrentUser,
        user: event.locals.user,
        form: await superValidate(createUserSchema),
        username: null
    };
};