import { db } from "$lib/db";
import { eq } from "drizzle-orm";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, } from "@sveltejs/kit";
import groupBy from "just-group-by"
import { Temporal } from "@js-temporal/polyfill";
import { config, fromTimeStr } from "./utils";
import { osteopathTable } from "$lib/db/schema";

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) redirect(308, '/')

  const osteopaths = db.query.osteopathTable.findMany({
    with: {
      user: true,
      course: true
    }
  })

  // current Osteopath;
  let osteopath;
  // current availabilities
  let availabilities;

  if (event.locals.user.role === 'osteopath') {
    osteopath = await db.query.osteopathTable.findFirst({
      where: eq(osteopathTable.userId, event.locals.user.id),
      with: {
        availabilities: true
      }
    })
    availabilities = osteopath?.availabilities || [];

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
      id: number,
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
    }

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
          time: slotStartAt.toLocaleString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
        }
        const end = {
          x: endAt * unit,
          time: slotEndAt.toLocaleString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
        }
        return {
          id: slot.id,
          start,
          end
        }
      })
    }
    availabilities = res;
  }
  event.depends('availabilities')
  return {
    user: {
      ...event.locals.user,
    },
    osteopaths: {
      data: osteopaths
    },
    availabilities,
  }
};
