import { Resend } from "resend";
import { RESEND_API_KEY } from "$env/static/private";

const resend = new Resend(RESEND_API_KEY);

export interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
	from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
	try {
		const { data, error } = await resend.emails.send({
			from: from || "Osteopaths <notifications@osteopaths.in>",
			to,
			subject,
			html
		});

		if (error) {
			console.error("Failed to send email:", error);
			return { success: false, error };
		}

		return { success: true, data };
	} catch (error) {
		console.error("Failed to send email:", error);
		return { success: false, error };
	}
}

export function generateNotificationEmail(title: string, body: string): string {
	return `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>${title}</title>
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
				<h1 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">${title}</h1>
				<p style="font-size: 16px; color: #4a5568; margin-bottom: 0;">${body}</p>
			</div>
			<div style="text-align: center; color: #718096; font-size: 14px;">
				<p>You received this notification from <a href="https://osteopaths.in" style="color: #4299e1; text-decoration: none;">Osteopaths.in</a></p>
			</div>
		</body>
		</html>
	`;
}
