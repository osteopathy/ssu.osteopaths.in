import type { Actions } from "./$types";

import { fail } from "@sveltejs/kit";

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData()
    formData.forEach((value, key) => {
      console.log(key, value)
    })
    if (!event.locals.user?.id) {
      return fail(400, {
        message: 'failed'
      });
    }

    try {
    } catch (error) {
      return fail(400, {
        message: error,
      })
    }
    return {};
  }
};