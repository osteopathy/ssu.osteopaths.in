<script lang="ts">
	import { Temporal } from 'temporal-polyfill';
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	import { ArrowRight, Check, Minus } from 'radix-icons-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		book: {
			duration: string;
			id: string;
			date: string;
			startTime: string;
		};
	}>();

	const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

	export let bydates: Record<
		string,
		{
			duration: string;
			id: string;
			date: string;
			startTime: string;
			osteopathId: string;
			userId: string | null;
		}[]
	>;

	const now = Temporal.Now.plainDateISO();

	let [year, month, day] = bydates[0]
		? Object.keys(bydates)[0]
				.split('-')
				.map((v) => +`${v}`)
		: [now.year, now.month, now.day];

	let today = new Temporal.PlainDate(year, month, day);

	export let selected = new Temporal.PlainDate(today.year, today.month, today.day);

	let selectedTimeslot: {
		id: string;
		date: string;
		startTime: string;
		duration: string;
	} | null = null;

	let min = new Temporal.PlainDate(today.year, today.month, today.day);
	let max = new Temporal.PlainDate(today.year, today.month, today.day).add({ months: 1 });

	let view = {
		weeks: [[], [], [], [], [], []],
		date: new Temporal.PlainYearMonth(selected.year, selected.month)
	} as {
		weeks: {
			day: Temporal.PlainDate;
			disabled: boolean;
			seats: {
				booked: (typeof bydates)[string];
				available: (typeof bydates)[string];
			};
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
			if (disabled === false)
				for (let i = 0; i < bydates[starting_point.toString()]?.length; i++) {
					console.log(bydates[starting_point.toString()][i].userId);
					if (bydates[starting_point.toString()][i].userId) {
						seats.booked.push(bydates[starting_point.toString()][i]);
					} else {
						seats.available.push(bydates[starting_point.toString()][i]);
					}
				}
			view.weeks[week]?.push({ day: starting_point, disabled, seats });
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
				if (disabled === false)
					for (let i = 0; i < bydates[starting_point.toString()]?.length; i++) {
						console.log(bydates[starting_point.toString()][i].userId);
						if (bydates[starting_point.toString()][i].userId) {
							seats.booked.push(bydates[starting_point.toString()][i]);
						} else {
							seats.available.push(bydates[starting_point.toString()][i]);
						}
					}
				view.weeks[week][index] = { day: starting_point, disabled, seats };
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

<div class="relative flex flex-col sm:flex-row">
	<div
		class="xs:p-3 border-layer-5 h-full w-full rounded-t-lg border-l-2 border-r-2 border-t-2 p-2 sm:rounded-l-lg sm:rounded-tr-none sm:border-b-2 sm:border-r-0 sm:p-4"
	>
		<div class="mb-4 flex items-center justify-between">
			<span class="text-lg font-bold">
				{header}
			</span>
			<div class="flex items-center gap-x-4">
				<button
					class="text-layer-11 disabled:text-layer-7 hover:bg-layer-3 rounded-md p-1"
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
					class="text-layer-11 disabled:text-layer-7 hover:bg-layer-3 -m-1 rounded-md p-1"
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
			<div role="rowgroup" class="flex w-full flex-col gap-0.5 rounded-md">
				{#each view.weeks as week}
					<div role="row" class="xs:gap-2 flex items-center gap-1 sm:gap-4">
						{#each week as { day, disabled, seats }}
							<button
								type="button"
								role="gridcell"
								class="xs:p-1.5 text-layer-11 border-layer-6 bg-layer-4 hover:bg-layer-6 disabled:!text-layer-7 aria-selected:bg-layer-13
								aria-selected:text-layer-0 group relative
								flex w-full items-center
								justify-center
								rounded-md
								border
								p-1
								disabled:border-transparent
								disabled:!bg-transparent
								aria-selected:border-transparent
								sm:p-2
							"
								aria-selected={selected.equals(day)}
								disabled={disabled || view.date.month !== day.month || day.since(min).sign === -1}
								on:click={() => {
									if (selected !== day) selectedTimeslot = null;
									selected = day;
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
										class="border-layer-0 group-aria-selected:bg-layer-13 group-aria-selected:text-layer-0 text-layer-12 absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded border bg-yellow-500 text-sm group-disabled:!invisible"
									>
										{seats.available.length}
									</span>
								{:else if seats.available.length !== 0}
									<span
										class="border-layer-0 group-aria-selected:bg-layer-13 group-aria-selected:text-layer-0 text-layer-12 bg-layer-5 absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded border text-sm group-disabled:!invisible"
									>
										{seats.available.length}
									</span>
								{:else if seats.booked.length > 0}
									<span
										class="border-layer-0 group-aria-selected:bg-layer-13 group-aria-selected:text-layer-0 text-layer-12 bg-layer-5 absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded border text-sm group-disabled:!invisible"
									>
										<Check />
									</span>
								{/if}
							</button>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div
		class="xs:p-3 border-layer-6 rounded-b-lg border-2 p-2 sm:rounded-r-lg sm:rounded-bl-none sm:p-4"
	>
		<h4 class="mb-3 whitespace-nowrap text-lg font-bold tabular-nums">
			{selected
				.toLocaleString('en-us', {
					day: 'numeric',
					weekday: 'short'
				})
				.split(' ')
				.reverse()
				.join(' ')}
		</h4>
		<ul class="flex flex-col gap-y-2">
			{#if bydates[selected.toString()]}
				{#each bydates[selected.toString()] as { id, date, startTime, duration, userId }}
					{@const [hour, minute] = startTime?.split(':').map((v) => +v)}
					{@const formattedStartTime = new Temporal.PlainTime(hour, minute).toLocaleString(
						'en-us',
						{
							hour: '2-digit',
							minute: '2-digit'
						}
					)}
					{@const formattedEndAt = new Temporal.PlainTime(hour, minute)
						.add({
							minutes: +`${duration}`
						})
						.toLocaleString('en-us', {
							hour: '2-digit',
							minute: '2-digit'
						})}
					<li class="">
						<button
							aria-pressed={selectedTimeslot?.id === id}
							on:click={() => {
								selectedTimeslot = {
									id,
									date,
									startTime,
									duration
								};
							}}
							disabled={userId !== null}
							class="aria-pressed:bg-layer-13 aria-pressed:text-layer-0
							disabled:bg-layer-2
							disabled:text-layer-7 bg-layer-3 group flex items-center gap-x-1 rounded-md
							px-1.5 py-0.5"
						>
							<span class="whitespace-nowrap tabular-nums">{formattedStartTime}</span>
							<Minus />
							<span class="whitespace-nowrap tabular-nums">{formattedEndAt}</span>
						</button>
					</li>
				{/each}
			{/if}
		</ul>
	</div>
	<div class="absolute bottom-4 right-4">
		{#if selectedTimeslot?.id}
			<button
				class="bg-layer-6 hover:bg-layer-7 inline-flex items-center gap-x-1 rounded-md px-2 py-1"
				on:click={() => {
					if (selectedTimeslot?.id) dispatch('book', selectedTimeslot);
				}}
				transition:fly={{
					delay: 50,
					duration: 300,
					y: 10,
					opacity: 0,
					easing: quintInOut
				}}
			>
				Book <ArrowRight class="h-4 w-4" />
			</button>
		{/if}
	</div>
</div>
