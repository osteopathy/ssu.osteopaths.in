import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/db";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) redirect(308, '/')

  const osteopaths = db.query.osteopathTable.findMany({
    with: {
      user: true,
      course: true
    }
  })

  return {
    user: {
      name: event.locals?.user?.name ?? '',
      image: event.locals?.user?.image ?? ''
    },
    osteopaths: {
      data: osteopaths
    }
  }
};
