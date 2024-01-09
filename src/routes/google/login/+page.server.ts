// routes/+page.server.ts
import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import getAuthorizationURL from "./getAuthorizationURL"

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData()
    const calendar = formData.get('calendar')?.toString() === 'true';
    const { url, cookies } = await getAuthorizationURL({
      calendar
    })
    event.cookies.set(cookies.google.name, cookies.google.value, cookies.google.otps);
    event.cookies.set(cookies.code.name, cookies.code.value, cookies.code.otps);
    if (calendar) event.cookies.set('google_calendar', 'true', cookies.google.otps);
    return redirect(302, url.toString());
  }
};
