import { db } from "$lib/server/db";
import { getUserIdByUsername } from "$lib/server/kv";
import { and, eq, gte } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";
import { appointmentTable, availabilityTable, courseTable, osteopathTable, userTable } from "$lib/db/schema";
import { error } from "@sveltejs/kit";
import { Temporal } from "temporal-polyfill";
import groupBy from "just-group-by"
import { config, fromTimeStr } from "./edit/utils";

type ByDatesType = Record<string, {
    date: string;
    id: string;
    userId: string | null;
    startTime: string;
    duration: string;
    osteopathId: string;
}[]>

function flatToWeeks(availabilities: any[]) {
    const grouped = groupBy(
        availabilities,
        (availability) => (availability.day !== null ? availability.day : 'sunday')
    );

    const startTime = new Temporal.PlainTime(config.startTime);
    const endTime = new Temporal.PlainTime(config.endTime);
    const gap = config.minGap;

    // sunday, monday, tuesday
    const keys = Object.keys(grouped) as unknown as [keyof typeof grouped];

    const res: Record<typeof keys[number], {
        id: string,
        start: {
            x: number,
            time: string
        },
        end: {
            x: number,
            time: string
        },
    }[]> = {
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
            return startA.since(startB).sign
        });

        const number_of_elements = (startTime.until(endTime).hours * 60 + startTime.until(endTime).minutes) / gap;
        const unit = 100 / number_of_elements;

        res[key] = grouped[key].map((slot) => {
            const slotStartAt = fromTimeStr(slot.startTime);
            const slotEndAt = fromTimeStr(slot.endTime);

            const startAt = (startTime.until(slotStartAt).hours * 60 + startTime.until(slotStartAt).minutes) / gap;
            const endAt = (startTime.until(slotEndAt).hours * 60 + startTime.until(slotEndAt).minutes) / gap;

            const start = {
                x: startAt * unit,
                time: slotStartAt.toLocaleString('en', { hour: '2-digit', minute: '2-digit', hour12: false }) as string
            };
            const end = {
                x: endAt * unit,
                time: slotEndAt.toLocaleString('en', { hour: '2-digit', minute: '2-digit', hour12: false }) as string
            }
            return {
                id: slot.id,
                start,
                end,
            }
        })
    }
    return res;
}

export const load: LayoutServerLoad = async (event) => {
    const userId = await getUserIdByUsername(event.params.username)

    const today = Temporal.Now.plainDateISO().toLocaleString('en', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const [month, day, year] = today.split('/');
    const t = `${year}-${month}-${day}`;

    if (!userId) error(404, {
        message: 'Username Not found',
    });

    if (userId === event.locals.user?.id) {
        const osteopath = await db.query.osteopathTable.findFirst({
            where: eq(osteopathTable.userId, userId),
            with: {
                course: true,
                appointments: {
                    where: gte(appointmentTable.date, t),
                    with: {
                        user: true
                    }
                },
                availabilities: true,
                calendar: true
            }
        })

        const bydates = groupBy(osteopath?.appointments || [], (appointment) => appointment.date as string) as ByDatesType;
        return {
            isCurrentUser: true,
            osteopath: {
                user: event.locals.user,
                ...osteopath
            },
            availabilities: flatToWeeks(osteopath?.availabilities || []),
            bydates
        }
    }

    const res = (await db.select().from(userTable).where(eq(userTable.id, userId))
        .leftJoin(osteopathTable, eq(userTable.id, osteopathTable.userId))
        .leftJoin(courseTable, eq(courseTable.id, osteopathTable.courseId))
        .leftJoin(availabilityTable, eq(availabilityTable.osteopathId, osteopathTable.id))
    )[0];
    
    if (!(res?.osteopath)) return error(404, {message: 'Username Not found',});

    const appointments = await db.select().from(appointmentTable).where(and(eq(appointmentTable.osteopathId, res.osteopath.id), gte(appointmentTable.date, t)))
    const availabilities = await db.select().from(availabilityTable).where(eq(availabilityTable.osteopathId, res.osteopath.id));

    const bydates = groupBy(appointments, (appointment) => appointment.date as string) as ByDatesType;
    return {
        isCurrentUser: false,
        osteopath: {
            user: res.user,
            ...res.osteopath,
            course: res.course
        },
        availabilities: flatToWeeks(availabilities || []),
        bydates
    }
};