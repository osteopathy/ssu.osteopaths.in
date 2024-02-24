import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

export const resend = new Resend(env.RESEND_API_KEY);

// await resend.emails.send({
//     from: 'Acme <onboarding@resend.dev>',
//     to: ['delivered@resend.dev'],
//     subject: 'hello world',
//     text: 'it works!',
//     headers: {
//       'X-Entity-Ref-ID': '123456789',
//     },
//     tags: [
//       {
//         name: 'category',
//         value: 'confirm_email',
//       },
//     ],
//   });
  