import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
	return {
		isLogged: !!event.locals.session,
		user: event.locals.user
	};
}) satisfies LayoutServerLoad;
