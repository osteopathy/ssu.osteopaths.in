import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    const result = await event.parent();
    if(!result.isCurrentUser) redirect(307,'/');
    if(!result.osteopath?.id) redirect(307,'/');
};