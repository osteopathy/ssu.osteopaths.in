import { articleAPI } from '$lib/db/firebase/article';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { osteopath, isCurrentUser } = await event.parent();
	if (!osteopath.id) redirect(307, '/');
	const articles = await articleAPI.getAll({
		osteopathId: osteopath.id,
		onlyPublished: !isCurrentUser
	});
	return {
		isCurrentUser,
		osteopath,
		articles: articles
	};
};

export const actions: Actions = {
	default: async (event) => {		
		console.log("RUNNING")
		const username = event.params.username;
		if (!event.locals.user)
			return fail(400, { message: 'undefined user' })
		const formData = await event.request.formData();
		const osteopathId = formData.get('osteopath-id')
		if(!osteopathId) return fail(400, { message: 'undefined osteopath id' })

		const article = await articleAPI.new(osteopathId?.toString());

		return redirect(307, `/${username}/articles/${article.id}/edit`)
	},
}  