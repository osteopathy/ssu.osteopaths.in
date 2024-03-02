import { PUBLIC_VAPID_KEY } from "$env/static/public";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (() => {
    return json({ data: PUBLIC_VAPID_KEY })
}) satisfies RequestHandler