import { Temporal } from 'temporal-polyfill';

export const config = {
	startTime: 9,
	endTime: 17,
	minGap: 30
};

const cacheMap = new Map<string | number, Temporal.PlainTime>();

export const fromTimeStr = (str: string): Temporal.PlainTime => {
	const r = cacheMap.get(str);
	if (r) return r;
	const [hour, min] = str.split(':').map((e) => +e);
	const v = new Temporal.PlainTime(hour, min);
	cacheMap.set(str, v);
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
