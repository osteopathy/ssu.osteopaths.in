export async function handleAdd(data: {
	osteopathId: string;
	day: string;
	startTime: string;
	endTime: string;
}) {
	const res = await fetch('/availability', {
		method: 'POST',
		body: JSON.stringify(data)
	}).then((r) => r.json());
	return res;
}

export async function handleUpdate(data: { id: string; startTime: string; endTime: string }) {
	const res = await fetch('/availability', {
		method: 'PUT',
		body: JSON.stringify(data)
	}).then((r) => r.json());
	return res;
}

export async function handleDelete(data: {
	id:string;
}) {
	const res = await fetch('/availability', {
		method: 'DELETE',
		body: JSON.stringify(data)
	}).then((r) => r.json());
	return res;
}
