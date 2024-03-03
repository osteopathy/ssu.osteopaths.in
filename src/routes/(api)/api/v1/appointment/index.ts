import type { Appointment, InsertAppointment } from "$lib/db/sqlite/schema";

export const appointment = {
	new: async (values: InsertAppointment) => {
		const res = await fetch('/api/v1/appointment/', {
			method: 'POST',
			body: JSON.stringify(values)
		});
		return res.json() as Promise<{
			data: Appointment
		}>;
	},
	put: async (id:string, values: Partial<Omit<Appointment, 'id'>>,) => {
		const res = await fetch(`/api/v1/appointment?id=${id}`, {
			method: 'PUT',
			body: JSON.stringify(values)
		});
		return res.json() as Promise<{
			data: Appointment
		}>;
	},
	del: async (id:number) => {
		const res = await fetch(`/api/v1/appointment?id=${id}`, {
			method: 'DELETE',
		});
		return res.json() as Promise<{
			data: Appointment
		}>;
	}
}