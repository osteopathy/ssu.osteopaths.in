import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
    const { token, title, body } = await event.request.json();
    if (!token)
        error(400, 'Missing parameters - token')

    try {
        const res = await fetch(
            `https://fcm.googleapis.com/v1/projects/${PUBLIC_FIREBASE_PROJECT_ID}/messages:send`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${PUBLIC_FIREBASE_API_KEY}`,
              },
              body: JSON.stringify({
                message: {
                  token: token,
                  notification: {
                    title: title ?? `Notification from V2O`,
                    body: body,
                  },
                },
              }),
            }
          )
        if (res.status < 200 || 299 < res.status) {
            const data = await res.json();
            return json(data)
        } else {
            return json({
                message: res.statusText
            })
        }
    } catch (error: any) {
        console.log(error);
        error(500, error.message ?? 'Internal Error')
    }
    return new Response();
};