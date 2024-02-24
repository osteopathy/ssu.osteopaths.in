export const email = {
	new: async ({subject, message}:{ subject:string, message: string }) => {
		const res = await fetch('/api/v1/email/', {
			method: 'POST',
			body: JSON.stringify({ subject, message }),
		})
		if (!res.ok) {
			throw new Error('Failed to send email');
		}
	},
}