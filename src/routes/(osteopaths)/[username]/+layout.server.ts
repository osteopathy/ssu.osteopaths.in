import { db } from "$lib/server/db";
import { getUserIdByUsername } from "$lib/server/kv";
import { and, eq, gte } from "drizzle-orm";
import type { LayoutServerLoad } from "./$types";
import { appointmentTable, courseTable, osteopathTable, userTable } from "$lib/db/schema";
import { error } from "@sveltejs/kit";
import { Temporal } from "temporal-polyfill";
import groupBy from "just-group-by"

type ByDatesType = Record<string, {
    date: string;
    id: string;
    userId: string | null;
    startTime: string;
    duration: string;
    osteopathId: string;
}[]>

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
                }
            }
        })

        const bydates = groupBy(osteopath?.appointments || [], (appointment) => appointment.date as string) as ByDatesType;
        return {
            isCurrentUser: true,
            user: event.locals.user,
            osteopath,
            bydates
        }
    }

    const res = (await db.select().from(userTable).where(eq(userTable.id, userId)).leftJoin(osteopathTable, eq(userTable.id, osteopathTable.userId)).leftJoin(courseTable, eq(courseTable.id, osteopathTable.courseId)))[0];

    if(res?.osteopath) {
        const appointments = await db.select().from(appointmentTable).where( and(eq(appointmentTable.osteopathId,res.osteopath.id),gte(appointmentTable.date, t)))
        const bydates = groupBy(appointments, (appointment) => appointment.date as string) as ByDatesType;
        return {
            isCurrentUser: false,
            user: res.user,
            osteopath: {
                ...res.osteopath,
                course: res.course
            },
            bydates
        }
    }
    return {
        isCurrentUser: false,
        user: res.user,
        osteopath: {
            ...res.osteopath,
            course: res.course
        },
        bydates: {} as ByDatesType
    }
};