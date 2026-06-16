import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/");
	return { isCurrentUser: event.locals.user.id === event.params.user_id, user: event.locals.user };
};
