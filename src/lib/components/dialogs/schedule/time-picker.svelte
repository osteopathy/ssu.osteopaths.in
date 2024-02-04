<script lang="ts">
	import { Temporal } from 'temporal-polyfill';
	import { cn } from '$lib/utils';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { createEventDispatcher } from 'svelte';

	let times = [] as Temporal.PlainTime[];

	let startTime = new Temporal.PlainTime(7, 0, 0);
	let endTime = new Temporal.PlainTime(18, 0, 0);

	let now = new Temporal.PlainTime(startTime.hour, startTime.minute);

	let fromTime: Temporal.PlainTime = new Temporal.PlainTime(9,0);
	let toTime: Temporal.PlainTime | undefined = new Temporal.PlainTime(10,0);

	function gapBetween(start: Temporal.PlainTime, end: Temporal.PlainTime) {
		const duration = end.since(start);
		return duration.hours * 60 + duration.minutes;
	}

	function isBetween(time: Temporal.PlainTime, start: Temporal.PlainTime, end: Temporal.PlainTime) {
		return (
			(time.since(start).sign === 1 && time.until(end).sign === 1) ||
			(time.since(end).sign === 1 && time.until(start).sign === 1)
		);
	}

	while (!now.equals(endTime)) {
		times.push(now);
		now = now.add({ minutes: 15 });
	}

	const dispatch = createEventDispatcher<{
		submit: { startTime: string; duration: string },
		cancel: undefined
	}>();
	let loading = false;
</script>

<div class="grid grid-cols-4 gap-1 pt-32 overflow-y-scroll pb-1 px-1 grow h-0 place-content-center">
	{#each times as time}
		<button
			type="button"
			on:click={() => {
				if (fromTime === undefined) fromTime = time;
				else if (toTime === undefined) toTime = time;
				else {
					toTime = undefined;
					fromTime = time;
				}
			}}
			class={cn(
				`px-1 text-base cursor-pointer rounded tabular-nums flex items-center justify-center border`,
				fromTime.equals(time) || (toTime && toTime.equals(time))
					? 'bg-blue-500 text-white dark:text-[--blue-13]'
					: 'hover:bg-blue-400 hover:text-white bg-muted text-foreground',
				toTime && isBetween(time, fromTime, toTime) && 'bg-blue-500 text-white'
			)}
		>
			{time.toLocaleString('en-us', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})}
		</button>
	{/each}
</div>

<div class="flex gap-x-2">
	<Button on:click={() => dispatch('cancel')} class="w-full" variant="outline">Cancel</Button>
	<Button
	disabled={loading}
	on:click={async () => {
		if (!toTime) return;
		let reverse = fromTime.until(toTime).sign === 1;
		const startTime = reverse ? fromTime : toTime;
		const startTimeStr = startTime.toLocaleString('en-us', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
		const endTime = reverse ? toTime : fromTime;
		const duration = gapBetween(startTime, endTime).toString();
		dispatch('submit', { startTime: startTimeStr, duration })
	}}
	class="w-full"
>
	{#if loading}
		<Spinner />
	{/if}
	Submit
</Button>
</div>