import { articleAPI } from "$lib/db/firebase/article";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
    const article = await articleAPI.get(event.params.article_id)
    return {
        article
    }
};