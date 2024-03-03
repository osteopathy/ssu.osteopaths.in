import type { RequestHandler } from "./$types";
import { error } from "@sveltejs/kit";
import { articleAPI } from "$lib/db/firebase/article";

export const PUT: RequestHandler = async (event) => {
  const content = await event.request.json()
  if (!event.locals.user)
    return error(400, { message: 'undefined user' })
  
  await articleAPI.put(event.params.article_id, {
    content: content,
    ...(event.url.searchParams.get('title') && {
      title: event.url.searchParams.get('title')?.toString()
    }),
    ...(event.url.searchParams.get('summary') && {
      summary: event.url.searchParams.get('summary')?.toString()
    }),
  });
  return new Response();
};
