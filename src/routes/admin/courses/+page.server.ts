// import { fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import { courseTable } from '$lib/db/schema';
import type { PageServerLoad } from './$types';
// import type { Actions } from './$types';
// import type { Key } from 'lucia';
// import { auth } from '$lib/server/lucia';
// import { createId } from '@paralleldrive/cuid2';
// import { db } from '$lib/shared/db';
// import { appointment, osteopath as osteopathTable, user } from '$lib/shared/db/schema/index.js';
// import { eq } from 'drizzle-orm';

export const load = (async () => {
  const courses = db.query.courseTable.findMany()
  return {
    courses: {
      data: courses
    }
  };
}) satisfies PageServerLoad;

export const actions = {
  create: async (event) => {
    const formData = await event.request.formData();
    // Create Key and User, If Osteopath connect User to Osteopath
    const courseName = formData.get('course-name')!;
    const courseduration = formData.get('course-duration')!;
    const response = await db.insert(courseTable).values({
      name: courseName.toString(),
      duration: courseduration.toString()
    }).returning()
    return { data: response[0] }
  },
}
//   delete: async (event) => {
//     const formData = await event.request.formData();
//     const userId = formData.get('user-id');
//     try {
//       console.log(userId)
//       // TODO: Fix SQLITE_CONSTRAINT: SQLite error: FOREIGN KEY constraint failed ERROR
//       if (userId) await db.delete(user).where(eq(user.id, userId.toString()))
//     } catch (error) {
//       console.log(error)
//     }
//   }
// } satisfies Actions;
