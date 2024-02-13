import { db } from "$lib/server/db";
import { error,type RequestHandler } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { osteopathTable, availabilityTable } from "$lib/db/schema";

export const POST: RequestHandler = (async ({ request, locals }) => {
  const { startTime, endTime, day, osteopathId } = await request.json();
  try {
    const data = await db.insert(availabilityTable).values({
      day,
      startTime,
      endTime,
      osteopathId,
    }).returning()
    return new Response(JSON.stringify({ message: "ADDED", data: data[0] }));
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed", error: true }));
  }
}) satisfies RequestHandler;

// export const PUT: RequestHandler = (async ({ request, locals }) => {
//   const { startTime, endTime, id } = await request.json();
//   console.log("STARTTIME", startTime, "ENDTIME", endTime, "ID", id);
//   try {
//     const data = await db.update(availabilityTable).set({
//       startTime,
//       endTime
//     }).where(eq(availabilityTable.id, id));
//     return new Response(JSON.stringify({ message: "Updated", data: { startTime, endTime } }));
//   } catch (error) {
//     return new Response(JSON.stringify({ message: "Failed", error: true }));
//   }
// }) satisfies RequestHandler

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


export const DELETE = (async ({ request }) => {
  const { id } = await request.json();
  try {
    const data = await db.delete(availabilityTable).where(eq(availabilityTable.id, id)).returning();
    return new Response(JSON.stringify({ message: "DELETED", data }));
  } catch (error) {
    return new Response(JSON.stringify({ message: "Failed", error: true }));
  }
}) satisfies RequestHandler;
