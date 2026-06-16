import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
	deleteJWTTokenCookie,
	deleteSessionTokenCookie,
	invalidateSession,
	sessionCookieName
} from "$lib/server/auth/session";
import { route } from "$lib/routes_helper";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user)
		return redirect(302, route("/[user_id]", { user_id: event.locals.user.id }));
	return {};
};

export const actions: Actions = {
	logout: async (event) => {
		const sessionToken = event.cookies.get(sessionCookieName);
		if (event.locals.user === null || !sessionToken) return fail(401);
		invalidateSession(sessionToken);
		deleteSessionTokenCookie(event);
		deleteJWTTokenCookie(event);
		return redirect(302, "/login");
	}
};
