import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  return {
    user: {
      name: event.locals.user?.name,
    }
  }
};
