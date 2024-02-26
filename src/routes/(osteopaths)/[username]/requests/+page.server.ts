import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (
		event.url.pathname === `/${event.params.username}/requests` ||
		event.url.pathname === `/${event.params.username}/requests/`
	)
		if (event.locals.user?.role === 'osteopath')
			redirect(307, `/${event.params.username}/requests/incoming`);
		else redirect(307, `/${event.params.username}/requests/outgoing`);
};
