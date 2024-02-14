<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle';
	import MultiSelectIcon from '$lib/components/ui/icons/multi-select.svelte';
	import { Temporal } from 'temporal-polyfill';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		select: { bydate: (typeof bydates)[string]; changed: boolean };
	}>();

	const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

	let multiSelect = false;
	let multiSelectable = false;
	export let editable = false;

	export let bydates: Record<
		string,
		{
			duration: string;
			id: string;
			date: string;
			startTime: string;
			osteopathId: string;
			userId: string | null;
			user: any;
		}[]
	>;

	const today = Temporal.Now.plainDateISO();

	export let selected = [new Temporal.PlainDate(today.year, today.month, today.day)];

	let min = new Temporal.PlainDate(today.year, today.month, today.day);
	let max = new Temporal.PlainDate(today.year, today.month, today.day).add({
		months: 1
	});

	let view = {
		weeks: [[], [], [], [], [], []],
		date: new Temporal.PlainYearMonth(selected[0].year, selected[0].month)
	} as {
		weeks: {
			disabled: boolean;
			day: Temporal.PlainDate;
			seats: {
				booked: (typeof bydates)[string];
				available: (typeof bydates)[string];
			};
			bydate: (typeof bydates)[string];
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

	if (firstDayOfMonth.dayOfWeek === 7) {
		starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1);
	} else {
		starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1).subtract({
			days: firstDayOfMonth.dayOfWeek
		});
	}

	for (let week = 0; week < 6; week++) {
		for (let index = 0; index < 7; index++) {
			const disabled = bydates[starting_point.toString()] ? false : true;
			let seats = {
				booked: [] as (typeof bydates)[string],
				available: [] as (typeof bydates)[string]
			};
			if (disabled === false || editable)
				for (let i = 0; i < bydates[starting_point.toString()]?.length; i++) {
					if (bydates[starting_point.toString()][i].userId) {
						seats.booked.push(bydates[starting_point.toString()][i]);
					} else {
						seats.available.push(bydates[starting_point.toString()][i]);
					}
				}
			// const seats = bydates[starting_point.toString()]?.length || 0;
			view.weeks[week]?.push({
				day: starting_point,
				seats,
				disabled,
				bydate: bydates[starting_point.toString()]
			});
			starting_point = starting_point.add({ days: 1 });
		}
	}

	const invalidateView = () => {
		firstDayOfMonth = new Temporal.PlainDate(view.date.year, view.date.month, 1);
		if (firstDayOfMonth.dayOfWeek === 7) {
			starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1);
		} else {
			starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1).subtract({
				days: firstDayOfMonth.dayOfWeek
			});
		}
		for (let week = 0; week < 6; week++) {
			for (let index = 0; index < 7; index++) {
				const disabled = bydates[starting_point.toString()] ? false : true;
				let seats = {
					booked: [] as (typeof bydates)[string],
					available: [] as (typeof bydates)[string]
				};
				if (disabled === false || editable)
					for (let i = 0; i < bydates[starting_point.toString()]?.length; i++) {
						if (bydates[starting_point.toString()][i].userId) {
							seats.booked.push(bydates[starting_point.toString()][i]);
						} else {
							seats.available.push(bydates[starting_point.toString()][i]);
						}
					}
				view.weeks[week][index] = {
					day: starting_point,
					seats,
					disabled,
					bydate: bydates[starting_point.toString()]
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
			{#if editable && multiSelectable}
				<Toggle
					bind:pressed={multiSelect}
					onPressedChange={(v) => {
						if (!v) {
							selected = [selected[selected.length - 1]];
						}
					}}
					aria-label="toggle multi-select"
					variant="outline"
					class="relative items-center gap-x-2 rounded-xl"
					size="sm"
				>
					<MultiSelectIcon />
					<span class="xs:h-[18px] xs:block hidden">Multi-Select</span>
					{#if multiSelect}
						<span
							class="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded border border-background bg-muted text-sm text-foreground group-disabled:!invisible group-aria-selected:bg-foreground group-aria-selected:text-background"
						>
							{selected.length}
						</span>
					{/if}
				</Toggle>
			{/if}
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
					{#each week as { day, seats, disabled, bydate }}
						<!-- TODO: daily numbers of sessions a osteopath take each day! -->
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
							aria-selected={multiSelect
								? selected.findIndex((d) => d.equals(day)) !== -1
								: selected[0].equals(day)}
							disabled={editable
								? view.date.month !== day.month || day.since(min).sign === -1
								: disabled || view.date.month !== day.month || day.since(min).sign === -1}
							on:click={() => {
								const changed = selected[0] !== day;
								if (multiSelect) {
									const index = selected.findIndex((d) => d.equals(day));
									if (index !== -1 && selected.length !== 1) {
										// present, remove it and return source!
										selected.splice(index, 1);
										selected = [...selected];
									} else {
										if (!selected[0].equals(day)) selected = [...selected, day];
									}
								} else {
									selected[0] = day;
								}
								// TODO: Add support for multiSelect
								if (!multiSelect) {
									dispatch('select', { bydate, changed });
								}
							}}
						>
							<time
								datetime={day.toString()}
								class="flex h-7 w-7 items-center justify-center tabular-nums"
							>
								{day.toLocaleString('en-us', { day: '2-digit' })}
							</time>
							{#if seats.available.length !== 0 && seats.booked.length !== 0}
								<span
									class="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded border border-background bg-yellow-500 text-sm text-foreground group-disabled:!invisible group-aria-selected:bg-foreground group-aria-selected:text-background"
								>
									{seats.available.length}
								</span>
							{:else if seats.available.length !== 0}
								<span
									class="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded border border-background bg-muted text-sm text-foreground group-disabled:!invisible group-aria-selected:bg-foreground group-aria-selected:text-background"
								>
									{seats.available.length}
								</span>
							{:else if seats.booked.length > 0}
								<span
									class="absolute -right-1 top-0 inline-flex h-4 w-4 items-center justify-center rounded border border-background bg-muted text-sm text-foreground group-disabled:!invisible group-aria-selected:bg-foreground group-aria-selected:text-background"
								>
									{seats.available.length}
								</span>
								<span
									class="absolute -right-1 bottom-0 inline-flex h-4 w-4 items-center justify-center rounded border border-background bg-teal-500 text-sm text-foreground group-disabled:!invisible group-aria-selected:bg-teal-600 group-aria-selected:text-background dark:group-aria-selected:bg-teal-300"
								>
									{seats.booked.length}
								</span>
							{/if}
						</button>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
