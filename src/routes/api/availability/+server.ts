import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import { availabilityTable, osteopathTable, userTable } from "$lib/db/schema";
import { and, eq } from "drizzle-orm";

export const PUT: RequestHandler = async (event) => {
  console.log("RUNNING")
  const userId = event.locals.user?.id;
  if (!userId) error(511, {
    message: 'Network Authentication Required'
  });
  const osteopath = await db.query.osteopathTable.findFirst({
    where: eq(osteopathTable.userId, userId),
  })
  if (!osteopath) error(500, {
    message: 'Unable to Fetch the osteopath'
  });

  console.log(osteopath)

  const request = await event.request.json();

  const pointers = request.markedPointers as {
    id: number,
    start: {
      x: number,
      time: string
    },
    end: {
      x: number,
      time: string
    },
  }[];

  const removed = await db.delete(availabilityTable).where(and(eq(availabilityTable.osteopathId, osteopath.id), eq(availabilityTable.day, request.day))).returning();
  console.log("REMOVED", removed)

  const results = await Promise.allSettled(pointers.map(pointer => {
    return db.insert(availabilityTable).values({
      day: request.day,
      osteopathId: osteopath.id,
      startTime: pointer.start.time,
      endTime: pointer.end.time
    })
  }))

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.log("ERROR: FAILED TO INSERT VALUE")
    }
  })

  return new Response();
};
