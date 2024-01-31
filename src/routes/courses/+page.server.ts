import { db } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    return {
        courses: db.query.courseTable.findMany()
    }    
};