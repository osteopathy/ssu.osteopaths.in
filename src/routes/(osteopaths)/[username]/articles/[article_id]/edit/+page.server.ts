import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { articleAPI } from "$lib/db/article";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async (event) => {
  const article = await articleAPI.get(event.params.article_id)
  return {
    article
  }
};

export const actions: Actions = {
  publish: async (event) => {
    if (!event.locals.user)
      return fail(400, { message: 'undefined user' })

    const article_id = await articleAPI.publish(event.params.article_id)
    return {article_id: article_id.id};
  },
  unpublish: async (event) => {
    if (!event.locals.user)
      return fail(400, { message: 'undefined user' })

    const article_id = await articleAPI.unpublish(event.params.article_id)
    return {article_id: article_id.id};
  },
  delete: async (event) => {
    if (!event.locals.user)
      return fail(400, { message: 'undefined user' })

    const article_id = await articleAPI.del(event.params.article_id)
    return {article_id: article_id.id};
  },
}
