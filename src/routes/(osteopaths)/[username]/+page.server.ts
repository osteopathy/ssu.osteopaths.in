import groupBy from "just-group-by";
import type { PageServerLoad } from "./$types";
import { Temporal } from "temporal-polyfill";
import { config, fromTimeStr } from "./utils";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { appointmentTable, availabilityTable, calendarTable, courseTable } from "$lib/db/schema";
import { and, eq, gte, lte, not } from "drizzle-orm";

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
    const { osteopath } = await event.parent();

    const from = Temporal.Now.plainDateISO()
    const to = from.add({
        days: config.maxDaysWithinWhichUserCanBookAppointment,
    });

    if (!osteopath.id) return error(404, { message: "Osteopath ID undefined" });
    // if (!osteopath?.courseId) return error(404, { message: "Osteopath hasn't register for a course" });
    const response =
        await Promise.allSettled(
            [
                db.query.appointmentTable.findMany({
                    where: and(
                        eq(appointmentTable.osteopathId, osteopath.id),
                        gte(appointmentTable.date, from.toString()),
                        eq(appointmentTable.status, 'confirmed')
                        // lte(appointmentTable, `${to.year}-${to.month.toString().padStart(2,'0')}-${to.day.toString().padStart(2,'0')}`)
                    )
                }),
                db
                    .select()
                    .from(availabilityTable)
                    .where(
                        eq(availabilityTable.osteopathId, osteopath.id)
                    ),
                osteopath?.courseId &&
                db.query.courseTable.findFirst({
                    where: eq(courseTable.id, osteopath.courseId)
                }),
                osteopath?.calendarId &&
                db.query.calendarTable.findFirst({
                    where: eq(calendarTable.id, osteopath.calendarId)
                })
            ]
        )

    const db_appointments = response[0].status === 'fulfilled' ? response[0].value : [];
    const availabilities = response[1].status === 'fulfilled' ? response[1].value : [];
    const course = response[2].status === 'fulfilled' ? response[2].value : null;
    const calendar = response[3].status === 'fulfilled' ? response[3].value : null;
    
    const appointments = groupBy(db_appointments, (appointment) => appointment.date as string);

    return {
        osteopath: {
			...osteopath,
            course: course
        },
        availabilities: flatToWeeks(availabilities || []),
        appointments,
        calendar
    };
};