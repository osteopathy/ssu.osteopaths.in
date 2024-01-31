import { createOsteopathSchema, osteopathTable, userTable } from "$lib/db/schema";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { createUsername, doesUsernameExist } from "$lib/server/kv";
import { generateId } from "lucia";

export const load: PageServerLoad = async () => {
  return {
    osteopaths: await db.query.osteopathTable.findMany({
      with: {
        user: {
          columns: {
            name: true
          }
        }
      }
    }),
    courses: await db.query.courseTable.findMany(),
    form: await superValidate(createOsteopathSchema)
  };
};

export const actions: Actions = {
  'create-osteopath': async (event) => {
    const form = await superValidate(event, createOsteopathSchema);

    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    const osteopath = form.data;
    const osteopathId = generateId(15);
    let usernameExist = false;

    try {
      if(osteopath.username) {
        usernameExist = await doesUsernameExist(osteopath.username)
      }
      await Promise.all([
        osteopath.username && !usernameExist && createUsername(osteopath.username, osteopathId, osteopath.userId),
        db.update(userTable).set({
          role: 'osteopath',
        }).where(eq(userTable.id, osteopath.userId)),
        db.insert(osteopathTable).values({
          ...osteopath,
          id: osteopathId,
        })
      ])
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
  'update-osteopath': async (event) => {
    const form = await superValidate(event, createOsteopathSchema);

    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    const osteopath = form.data;

    if (!osteopath.id) {
      return fail(400, {
        form
      });
    }

    try {
      await db.update(osteopathTable).set(osteopath).where(eq(osteopathTable.id, osteopath.id));
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