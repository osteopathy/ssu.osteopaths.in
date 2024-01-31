import { userTable, createUserSchema } from "$lib/db/schema";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";


export const load: PageServerLoad = async () => {

  return {
    users: await db.query.userTable.findMany(),
    form: await superValidate(createUserSchema)
  };
};

export const actions: Actions = {
  'create-user': async (event) => {
    const form = await superValidate(event, createUserSchema);

    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    const user = form.data;
    try {
      await db.insert(userTable).values(user);
    } catch (error) {
      return fail(404, {
        message: error,
        form
      })
    }
    return {
      form
    };
  },
  'update-user': async (event) => {
    const form = await superValidate(event, createUserSchema);

    if (!form.valid) {
      return fail(400, {
        form
      });
    }
    
    let user = form.data;

    if(!user.id) {
      return fail(400, {
        form
      });
    }
    const removeNullUndefined = <T extends Object>(obj:T) => Object.entries(obj).reduce((a, [k, v]) => (v == null ? a : (a[k] = v, a)), {});
    user = removeNullUndefined(user);
    try {
      await db.update(userTable).set(user).where(eq(userTable.id, user.id));
    } catch (error) {
      return fail(404, {
        message: error,
        form
      })
    }
    return {
      form
    };
  }
};