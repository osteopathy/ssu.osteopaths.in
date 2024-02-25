<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle';
	import MultiSelectIcon from '$lib/components/ui/icons/multi-select.svelte';
	import { Temporal } from 'temporal-polyfill';
	import { createEventDispatcher } from 'svelte';
	import type { LayoutServerData, PageServerData } from './$types';
	import { config } from './utils';

	const dispatch = createEventDispatcher<{
		change: { day: string };
	}>();

	const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday','sunday'];

	export let availabilities: PageServerData['availabilities'];
	// export let appointments: PageServerData['appointments'];

	const today = Temporal.Now.plainDateISO();

	export let selected:Temporal.PlainDate;

	let min = new Temporal.PlainDate(today.year, today.month, today.day);
	let max = today.add({
		days: config.maxDaysWithinWhichUserCanBookAppointment
	});

	let view = {
		weeks: [[], [], [], [], [], []],
		date: new Temporal.PlainYearMonth(selected.year, selected.month)
	} as {
		weeks: {
			disabled: boolean;
			day: Temporal.PlainDate;
		}[][];
		date: Temporal.PlainYearMonth;
	};

	$: header = new Temporal.PlainDate(view.date.year, view.date.month, 1).toLocaleString('en-us', {
		month: 'long',
		year: 'numeric'
	});

	let firstDayOfMonth: Temporal.PlainDate;
	let starting_point: Temporal.PlainDate;
	firstDayOfMonth = new Temporal.PlainDate(view.date.year, view.date.month, 1);
	starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1).subtract({
		days: firstDayOfMonth.dayOfWeek - 1
	});

	for (let week = 0; week < 6; week++) {
		for (let index = 0; index < 7; index++) {
			// const seats = bydates[starting_point.toString()]?.length || 0;
			view.weeks[week]?.push({
				day: starting_point,
				disabled: false
			});
			starting_point = starting_point.add({ days: 1 });
		}
	}

	const invalidateView = () => {
		firstDayOfMonth = new Temporal.PlainDate(view.date.year, view.date.month, 1);
		starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1).subtract({
			days: firstDayOfMonth.dayOfWeek - 1
		});
		for (let week = 0; week < 6; week++) {
			for (let index = 0; index < 7; index++) {
				view.weeks[week][index] = {
					day: starting_point,
					disabled: false
				};
				starting_point = starting_point.add({ days: 1 });
			}
		}
	};

	const nextMonth = () => {
		view.date = view.date.add({ months: 1 });
		invalidateView();
	};

	const prevMonth = () => {
		view.date = view.date.subtract({ months: 1 });
		invalidateView();
	};
</script>

<div
	class="
        xs:p-3 h-full w-full rounded-t-lg border-l-2 border-r-2 border-t-2 p-2 sm:rounded-l-lg sm:rounded-tr-none sm:border-b-2 sm:border-r-0 sm:p-4
    "
>
	<div class="mb-4 flex items-center justify-between">
		<span class="text-lg font-bold">
			{header}
		</span>
		<div class="flex items-center gap-x-4">
			<button
				class="rounded-md p-1 hover:bg-muted disabled:text-muted-foreground"
				on:click={() => prevMonth()}
				disabled={view.date.since(min).sign === 0}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					stroke="currentColor"
					class="h-5 w-5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</button>
			<button
				disabled={view.date.until(max).sign === 0}
				class="rounded-md p-1 hover:bg-muted disabled:text-muted-foreground"
				on:click={() => nextMonth()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					stroke="currentColor"
					class="h-5 w-5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>
		</div>
	</div>
	<div role="grid" class="flex w-full flex-col gap-y-1">
		<div
			role="row"
			class="xs:gap-x-2 mb-2 grid grid-cols-7 place-content-center gap-x-1 sm:gap-x-4"
		>
			{#each days as day}
				<div role="columnheader" class="flex items-center justify-center uppercase">
					{day[0] + day[1] + day[2]}
				</div>
			{/each}
		</div>
		<div role="rowgroup" class="flex w-full flex-col gap-0.5 rounded-md sm:gap-2">
			{#each view.weeks as week}
				<div role="row" class="xs:gap-2 flex items-center gap-1 sm:gap-4">
					{#each week as { day, disabled }, i}
						<!-- TODO: daily numbers of sessions a osteopath take each day! -->
						{#if day.dayOfWeek === i + 1}
							<button
								type="button"
								role="gridcell"
								class="
                            xs:p-1.5
                            group relative flex
                            w-full items-center justify-center
                            rounded-md border
                            bg-muted p-1 text-foreground
                            hover:bg-muted/80
                            disabled:border-transparent
                            disabled:!bg-transparent
                            disabled:!text-muted-foreground/50
                            aria-selected:border-transparent
                            aria-selected:bg-blue-500
                            aria-selected:text-white
                            sm:p-2"
								aria-selected={selected.equals(day)}
								disabled={view.date.month !== day.month || today.equals(day) || day.since(min).sign === -1 || day.until(max).sign === -1}
								on:click={() => {
									const changed = selected !== day;
									selected = day;
									if(changed) {
										dispatch('change', { day: selected.toLocaleString('en',
											{
												weekday: 'long'
											}
										).toLowerCase()})
									}
								}}
							>
								<time
									datetime={day.toString()}
									class="flex h-7 w-7 items-center justify-center tabular-nums"
								>
									{day.toLocaleString('en-us', { day: '2-digit' })}
								</time>
							</button>
						{/if}
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
