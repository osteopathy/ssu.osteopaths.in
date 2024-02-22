import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
    const result = await event.parent();
    const [_,username,appointments,dashboard] = event.url.pathname.split('/');
    if(!dashboard) redirect(307,`/${username}/appointments/requests`)
    if(!result.isCurrentUser) redirect(307,'/');
    if(!result.osteopath?.id) redirect(307,'/');
};