import { Temporal } from 'temporal-polyfill';

export const config = {
	startTime: 9,
	endTime: 20,
	minGap: 30,
	// Total number of days within which the user can book an appointment
	maxDaysWithinWhichUserCanBookAppointment: 4,
};

const cacheTimeMap = new Map<string | number, Temporal.PlainTime>();

export const fromDateStr = (str: string): Temporal.PlainDate => {
	const [year,month,day] = str?.split('-').map((v) => +v) ?? [2024,1,1];
	return new Temporal.PlainDate(year, month,day);
};

export const fromTimeStr = (str: string): Temporal.PlainTime => {
	const r = cacheTimeMap.get(str);
	if (r) return r;
	const [hour, min] = str.split(':').map((e) => +e);
	const v = new Temporal.PlainTime(hour, min);
	cacheTimeMap.set(str, v);
	return v;
};

export function divideTimeIntoX(fromHour: number, toHour: number, minGap: number) {
	// generate 8 to 6 with 15 mins gap time
	const view: { time: Temporal.PlainTime; x: number }[] = [];
	const startTime = new Temporal.PlainTime(fromHour);
	const endTime = new Temporal.PlainTime(toHour);

	let now = new Temporal.PlainTime(fromHour);
	let x = 0;

	const number_of_elements = startTime.until(endTime).hours * (60 / minGap);
	const unit = 100 / number_of_elements;

	while (now.until(endTime).sign >= 0) {
		view.push({ time: now, x });
		now = now.add({
			minutes: minGap
		});
		x += unit;
	}

	return [view, unit] as const;
}
