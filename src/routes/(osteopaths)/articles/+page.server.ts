import { articleAPI } from "$lib/db/firebase/article";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const articles = await articleAPI.getAll({
        onlyPublished: true
    });
    return {
        articles,
    }
};