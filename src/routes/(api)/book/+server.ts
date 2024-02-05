import { error, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { appointmentTable, calendarTable, osteopathTable, userTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { Temporal } from 'temporal-polyfill';
import calendarService from '$lib/server/calendar';

export const POST = (async (event) => {
    if (!(event.locals?.user)) return new Response(null, {
        status: 400
    });
    let { duration, startTime, date, userId ,osteopathGmail, osteopathId, calendarId, appointmentId } = await event.request.json();

    const res = (await db.update(appointmentTable).set({ userId }).where(eq(appointmentTable.id, appointmentId)).returning())[0];

    duration = +`${duration || 30}`;
    const [year, month, day] = date.split('-').map((v: string) => +`${v}`);
    const [hour, minute] = startTime.split(':').map((v: string) => +`${v}`);
    const StartTime = new Temporal.PlainDateTime(year, month, day, hour, minute);
    const EndTime = StartTime.add({
        minutes: duration
    });


    const reqObj = {
        startTime: StartTime.toString(),
        endTime: EndTime.toString(),
        summary: `Osteopathy Session with ${event.locals.user.name}`,
        host: {
            email: osteopathGmail,
        },
        nonHost: {
            email: event.locals.user?.gmail as string
        }
    }
    

    const db_calendar = await db.query.calendarTable.findFirst({where: eq(calendarTable.id, calendarId)});

    if(!db_calendar) return error(404,'Calendar not found');
    
    const calendarAPI = calendarService({
        calendarId: calendarId,
        access_token: db_calendar.accessToken,
        refresh_token: db_calendar.refreshToken,
    });
    
    const calendar = await calendarAPI.getCalendar(db_calendar.calendarId ? db_calendar.calendarId : undefined).catch((e) => console.log(e));

    if (calendar?.id) {
        console.log(
          'SENDING Request \n\n',
          JSON.stringify(reqObj,null,2),
          '\n\n'
        );
        const event = await calendarAPI.createEvent(calendar.id, reqObj);
        console.log('Submitted', event);
        // if (event?.id && event.attendees) {
        //   console.log('SENDING UPDATE EVENT');
        //   const attendeeIndex = event.attendees?.findIndex(
        //     (attendee) => attendee.email === osteopathGmail
        //   );
        //   if (attendeeIndex)
        //     event.attendees[attendeeIndex] = {
        //       ...event.attendees[attendeeIndex],
        //       responseStatus: 'accepted'
        //     };
        //   const rsvp = await calendarAPI.updateEvent(calendar.id, event?.id, event);
        //   console.log('\n\nUPDATED', rsvp);
        // } else {
        //   // TODO: Add Exception statement
        // }
      }
    return new Response(JSON.stringify({ message: 'CREATED', data: res }));
}) satisfies RequestHandler;

export const DELETE = (async ({ request, locals }) => {
    if (!(locals?.user)) return new Response(null, {
        status: 400
    });
    const { appointmentId } = await request.json();
    const res = (await db.delete(appointmentTable).where(eq(appointmentTable.id, appointmentId)).returning())[0];
    return new Response(JSON.stringify({ message: 'DELETED', data: res }));
}) satisfies RequestHandler;
