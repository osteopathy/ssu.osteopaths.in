import { articleAPI } from "$lib/db/article";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const articles = await articleAPI.getAll();
    return {
        articles,
    }
};