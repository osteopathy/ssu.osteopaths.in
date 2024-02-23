import groupBy from "just-group-by";
import type { PageServerLoad } from "./$types";
import { Temporal } from "temporal-polyfill";
import { config, fromTimeStr } from "./utils";
import { error } from "@sveltejs/kit";
import { getUserIdByUsername } from "$lib/server/kv";
import { db } from "$lib/server/db";
import { appointmentTable, availabilityTable, calendarTable, courseTable, osteopathTable, userTable } from "$lib/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";

function flatToWeeks(availabilities: any[]) {
    const grouped = groupBy(availabilities, (availability) =>
        availability.day !== null ? availability.day : 'sunday'
    );

    const startTime = new Temporal.PlainTime(config.startTime);
    const endTime = new Temporal.PlainTime(config.endTime);
    const gap = config.minGap;

    // sunday, monday, tuesday
    const keys = Object.keys(grouped) as unknown as [keyof typeof grouped];

    const res: Record<
        (typeof keys)[number],
        {
            id: string;
            start: {
                x: number;
                time: string;
            };
            end: {
                x: number;
                time: string;
            };
        }[]
    > = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        friday: [],
        thursday: [],
        saturday: []
    } as const;

    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];

        grouped[key].sort((a, b) => {
            const startA = fromTimeStr(a.startTime);
            const startB = fromTimeStr(b.startTime);
            return startA.since(startB).sign;
        });

        const number_of_elements =
            (startTime.until(endTime).hours * 60 + startTime.until(endTime).minutes) / gap;
        const unit = 100 / number_of_elements;

        res[key] = grouped[key].map((slot) => {
            const slotStartAt = fromTimeStr(slot.startTime);
            const slotEndAt = fromTimeStr(slot.endTime);

            const startAt =
                (startTime.until(slotStartAt).hours * 60 + startTime.until(slotStartAt).minutes) / gap;
            const endAt =
                (startTime.until(slotEndAt).hours * 60 + startTime.until(slotEndAt).minutes) / gap;

            const start = {
                x: startAt * unit,
                time: slotStartAt.toLocaleString('en', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }) as string
            };
            const end = {
                x: endAt * unit,
                time: slotEndAt.toLocaleString('en', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }) as string
            };
            return {
                id: slot.id,
                start,
                end
            };
        });
    }
    return res;
}

// Definition of the page
// This file is used to fetch the details of osteopath from there [username]
// then, it fetches the availabilities and appointments of the osteopath in upcoming days
export const load: PageServerLoad = async (event) => {
    const userId = await getUserIdByUsername(event.params.username);

    const from = Temporal.Now.plainDateISO()
    const to = from.add({
        days: config.maxDaysWithinWhichUserCanBookAppointment,
    });

    if (!userId)
        error(404, {
            message: 'Username Not found'
        });

    if (userId === event.locals.user?.id) {
        const osteopath = await db.query.osteopathTable.findFirst({
            where: eq(osteopathTable.userId, userId),
            with: {
                course: true,
                appointments: {
                    where: and(gte(appointmentTable.date, `${from.year}-${from.month}-${from.day}`), lte(appointmentTable, `${to.year}-${to.month}-${to.day}`)),
                    with: {
                        user: true
                    }
                },
                availabilities: true,
                calendar: true
            }
        })

        const appointments = groupBy(
            osteopath?.appointments || [],
            (appointment) => appointment.date as string
        );

        return {
            isCurrentUser: true,
            osteopath: {
                user: event.locals.user,
                ...osteopath
            },
            availabilities: flatToWeeks(osteopath?.availabilities || []),
            appointments,
            calendar: osteopath?.calendar ? osteopath.calendar : null
        };
    }
    const res = (
        await db
            .select()
            .from(userTable)
            .where(eq(userTable.id, userId))
            .leftJoin(osteopathTable, eq(userTable.id, osteopathTable.userId))
            .leftJoin(courseTable, eq(courseTable.id, osteopathTable.courseId))
            .leftJoin(calendarTable, eq(calendarTable.id, osteopathTable.calendarId))
    )[0];

    if (!res?.osteopath) return error(404, { message: 'Osteopath Not found' });

    const db_appointments = await db
        .select()
        .from(appointmentTable)
        .where(and(eq(appointmentTable.osteopathId, res.osteopath.id), and(gte(appointmentTable.date, `${from.year}-${from.month}-${from.day}`), lte(appointmentTable, `${to.year}-${to.month}-${to.day}`))));
    const availabilities = await db
        .select()
        .from(availabilityTable)
        .where(eq(availabilityTable.osteopathId, res.osteopath.id));
    
    const appointments = groupBy(db_appointments, (appointment) => appointment.date as string);
    return {
		isCurrentUser: false,
		osteopath: {
			user: res.user,
			...res.osteopath,
			course: res.course
		},
		availabilities: flatToWeeks(availabilities || []),
		appointments,
        calendar: res.calendar
	};
};