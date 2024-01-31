import { superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { formSchema } from "./schema";
import { fail } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { osteopathTable } from "$lib/db/schema";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
  return {
    form: await superValidate(formSchema)
  }
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, formSchema);

    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    if (!event.locals.user?.id) {
      return fail(400, {
        form
      });
    }

    const osteopath = form.data;
    try {
      await db.update(osteopathTable).set({
        about: osteopath.about
      }).where(eq(osteopathTable.userId, event.locals.user.id))
    } catch (error) {
      return fail(400, {
        message: error,
        form
      })
    }
    return {
      form
    };
  }
};