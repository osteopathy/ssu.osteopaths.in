import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) redirect(308, '/')
  return {
    user: {
      name: event.locals.user.name,
      image: event.locals.user.image
    }
  }
};
