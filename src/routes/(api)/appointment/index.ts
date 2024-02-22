export const createAppointment = async (values: {
	osteopathId: string;
	duration: string;
	startTime: string;
	date: string;
}) => {
	const res = await fetch('/appointment/', {
		method: 'POST',
		body: JSON.stringify(values)
	});
	return res.json() as Promise<{
		message: 'CREATED';
		data: {
			id: string;
			osteopathId: string;
			date: string;
			duration: string;
			startTime: string;
			userId: string | null;
		};
	}>;
};

export const updateAppointment = async (
	appointmentId: string,
	values: { osteopathId?: string; duration?: string; startTime?: string; date?: string }
) => {
	const res = await fetch(`/appointment/`, {
		method: 'PATCH',
		body: JSON.stringify({
			appointmentId,
			...values
		})
	});
	return res.json();
};

export const deleteAppointment = async (appointmentId: string) => {
	const res = await fetch(`/appointment`, {
		method: 'DELETE',
		body: JSON.stringify({ appointmentId })
	});
	return res.json();
};
