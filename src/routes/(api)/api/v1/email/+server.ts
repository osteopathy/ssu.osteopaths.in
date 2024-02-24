import { resend } from "$lib/server/resend";
import { Temporal } from "temporal-polyfill";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {

    const { subject, message } = await event.request.json() as { subject:string, message: string };
    
    const { data, error } = await resend.emails.send({
        from: 'Sukhpreet Singh <ssu@osteopaths.in>',
        to: ['sukhpreetben10@gmail.com'],
        subject,
        html: `<strong>${message}</strong><br/>${Temporal.Now.plainDateTimeISO().toLocaleString('en-us')}`,
    });
    if (error) {
        console.error({ error });
    }
    console.log({ data });
    return new Response();
};