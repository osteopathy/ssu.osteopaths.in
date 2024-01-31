<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Popover from '$lib/components/ui/popover';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';

	import { Toggle } from '$lib/components/ui/toggle';
	import MultiSelectIcon from '$lib/components/ui/icons/multi-select.svelte';
	import TimePicker from './time-picker.svelte';
	import { Temporal } from 'temporal-polyfill';
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	import { ArrowRight, Check, PlusCircled, Minus, DotsVertical } from 'radix-icons-svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		book: {
			duration: '30' | '45' | '60';
			id: string;
			date: string;
			startTime: string;
		};
	}>();

	const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

	export let bydates: Record<
		string,
		{
			duration: '30' | '45' | '60';
			id: string;
			date: string;
			startTime: string;
			osteopathId: string;
			userId: string | null;
			user: any
		}[]
	>;

	// const [year, month, day] = Object.keys(bydates)[0]
	// 	?.split('-')
	// 	.map((v) => +`${v}`);

	const today = Temporal.Now.plainDateISO();

	export let selected = [new Temporal.PlainDate(today.year, today.month, today.day)];

	let selectedTimeslot: {
		id: string;
		date: string;
		startTime: string;
		duration: '30' | '45' | '60';
	} | null = null;

	let min = new Temporal.PlainDate(today.year, today.month, today.day)
	let max = new Temporal.PlainDate(today.year, today.month, today.day).add({
		months: 1
	});

	let view = {
		weeks: [[], [], [], [], [], []],
		date: new Temporal.PlainYearMonth(selected[0].year, selected[0].month)
	} as {
		weeks: {
			day: Temporal.PlainDate;
			seats: {
				booked: (typeof bydates)[string];
				available: (typeof bydates)[string];
			};
		}[][];
		date: Temporal.PlainYearMonth;
	};

	$: header = new Temporal.PlainDate(view.date.year,view.date.month,1).toLocaleString(
		'en-us',
		{
			month: 'long',
			year: 'numeric'
		}
	);

	let firstDayOfMonth: Temporal.PlainDate;
	let starting_point: Temporal.PlainDate;
	firstDayOfMonth = new Temporal.PlainDate(view.date.year,view.date.month,1);

	if (firstDayOfMonth.dayOfWeek === 7) {
		starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1);
	} else {
		starting_point = new Temporal.PlainDate(view.date.year, view.date.month, 1).subtract({
			days: firstDayOfMonth.dayOfWeek
		});
	}

	for (let week = 0; week < 6; week++) {
		for (let index = 0; index < 7; index++) {
			let seats = {
				booked: [] as (typeof bydates)[string],
				available: [] as (typeof bydates)[string]
			};
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
				seats
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
				let seats = {
					booked: [] as (typeof bydates)[string],
					available: [] as (typeof bydates)[string]
				};
				for (let i = 0; i < bydates[starting_point.toString()]?.length; i++) {
					if (bydates[starting_point.toString()][i].userId) {
						seats.booked.push(bydates[starting_point.toString()][i]);
					} else {
						seats.available.push(bydates[starting_point.toString()][i]);
					}
				}
				view.weeks[week][index] = { day: starting_point, seats };
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
	let multiSelect = false;
	let timePicker: {
		data: {
			startTime: Temporal.PlainTime | undefined;
			endTime: Temporal.PlainTime | undefined;
			id: string | undefined;
		};
		dialog: HTMLDialogElement | undefined;
	} = {
		dialog: undefined,
		data: {
			startTime: undefined,
			endTime: undefined,
			id: undefined
		}
	};

	let addTimePopOverOpen = false;

	export let osteopathId:string;
</script>

<div class="flex flex-col sm:flex-row relative">
	<div
		class="p-2 xs:p-3 sm:p-4 border-l-2 border-r-2 border-t-2 rounded-t-lg sm:border-r-0 sm:border-b-2 sm:rounded-tr-none sm:rounded-l-lg h-full w-full border-layer-5"
	>
		<div class="flex items-center justify-between mb-4">
			<span class="text-lg font-bold">
				{header}
			</span>
			<div class="flex items-center gap-x-4">
				<Toggle
					bind:pressed={multiSelect}
					onPressedChange={(v) => {
						if (!v) {
							selected = [selected[selected.length - 1]];
						}
					}}
					aria-label="toggle multi-select"
					variant="outline"
					class="rounded-xl relative gap-x-2 items-center"
					size="sm"
				>
					<MultiSelectIcon />
					<span class="hidden xs:h-[18px] xs:block">Multi-Select</span>
					{#if multiSelect}
						<span
							class="absolute text-sm border border-layer-0 group-disabled:!invisible group-aria-selected:bg-layer-13 group-aria-selected:text-layer-0 text-layer-12 inline-flex items-center justify-center -top-1 -right-1 bg-layer-5 w-4 h-4 rounded"
						>
							{selected.length}
						</span>
					{/if}
				</Toggle>
				<button
					class="p-1 text-layer-11 disabled:text-layer-7 hover:bg-layer-3 rounded-md"
					on:click={() => prevMonth()}
					disabled={view.date.since(min).sign === 0}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2.5"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
					</svg>
				</button>
				<button
					disabled={view.date.until(max).sign === 0}
					class="p-1 -m-1 text-layer-11 disabled:text-layer-7 hover:bg-layer-3 rounded-md"
					on:click={() => nextMonth()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2.5"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
					</svg>
				</button>
			</div>
		</div>
		<div role="grid" class="flex w-full flex-col gap-y-1">
			<div
				role="row"
				class="grid grid-cols-7 place-content-center gap-x-1 xs:gap-x-2 sm:gap-x-4 mb-2"
			>
				{#each days as day}
					<div role="columnheader" class="flex items-center justify-center uppercase">
						{day[0] + day[1] + day[2]}
					</div>
				{/each}
			</div>
			<div role="rowgroup" class="flex w-full flex-col rounded-md gap-0.5">
				{#each view.weeks as week}
					<div role="row" class="flex items-center gap-1 xs:gap-2 sm:gap-4">
						{#each week as { day, seats }}
							<!-- TODO: Limit the numbers of sessions a osteopath can decide to take! -->
							<button
								type="button"
								role="gridcell"
								class="flex w-full items-center justify-center p-1 xs:p-1.5 sm:p-2
								text-layer-11 border border-layer-6
								bg-layer-4 hover:bg-layer-6 rounded-md
								disabled:border-transparent
								disabled:!bg-transparent
								disabled:!text-layer-7
								aria-selected:bg-layer-13
								aria-selected:text-layer-0
								aria-selected:border-transparent
								group
								relative
							"
								aria-selected={multiSelect
									? selected.findIndex((d) => d.equals(day)) !== -1
									: selected[0].equals(day)}
								disabled={view.date.month !== day.month || day.since(min).sign === -1}
								on:click={() => {
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
										if (!selected[0].equals(day)) {
											selectedTimeslot = null;
										}
										selected[0] = day;
									}
								}}
							>
								<time
									datetime={day.toString()}
									class="flex items-center justify-center tabular-nums w-7 h-7"
								>
									{day.toLocaleString('en-us', { day: '2-digit' })}
								</time>
								{#if seats.available.length !== 0 && seats.booked.length !== 0}
									<span
										class="absolute text-sm border border-layer-0 group-disabled:!invisible group-aria-selected:bg-layer-13 group-aria-selected:text-layer-0 text-layer-12 inline-flex items-center justify-center -top-1 -right-1 bg-yellow-500 w-4 h-4 rounded"
									>
										{seats.available.length}
									</span>
								{:else if seats.available.length !== 0}
									<span
										class="absolute text-sm border border-layer-0 group-disabled:!invisible group-aria-selected:bg-layer-13 group-aria-selected:text-layer-0 text-layer-12 inline-flex items-center justify-center -top-1 -right-1 bg-layer-5 w-4 h-4 rounded"
									>
										{seats.available.length}
									</span>
								{:else if seats.booked.length > 0}
									<span
										class="absolute top-0 text-sm border border-layer-0 group-disabled:!invisible group-aria-selected:bg-layer-13 group-aria-selected:text-layer-0 text-layer-12 inline-flex items-center justify-center -right-1 bg-layer-5 w-4 h-4 rounded"
									>
										{seats.available.length}
									</span>
									<span
										class="absolute bottom-0 text-sm border border-layer-0 group-disabled:!invisible group-aria-selected:bg-teal-600 dark:group-aria-selected:bg-teal-300 group-aria-selected:text-layer-0 text-layer-12 inline-flex items-center justify-center -right-1 bg-teal-500 w-4 h-4 rounded"
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
	<div
		class="p-2 xs:p-3 sm:p-4 border-2 border-layer-6 rounded-b-lg sm:rounded-bl-none sm:rounded-r-lg flex flex-col gap-y-3"
	>
		<div class="w-full flex items-center justify-between gap-x-2">
			<h4 class="whitespace-nowrap text-lg font-bold tabular-nums">
				{selected[0]
					.toLocaleString('en-us', {
						day: 'numeric',
						weekday: 'short'
					})
					.split(' ')
					.reverse()
					.join(' ')}
			</h4>
			<Popover.Root  bind:open={addTimePopOverOpen}>
				<Popover.Trigger
					class="ml-2 inline-flex items-center gap-x-1 bg-[--blue-4] hover:bg-[--blue-5] text-[--blue-12] px-1 py-0.5 rounded-md"
				>
					<PlusCircled class="w-4 h-4" /> <span class="whitespace-nowrap h-[22px]">Slots</span>
					<!-- <Button builders={[builder]} size="sm-icon" variant="ghost">
									<PlusCircleIcon size={20} />
								</Button> -->
				</Popover.Trigger>
				<Popover.Content class="p-0 w-max flex bg-layer-0 flex-col h-[267px] rounded-lg gap-y-2">
					<TimePicker
						{osteopathId}
						day={selected.toString()}
						on:load={({ detail }) => {
							if (bydates[selected.toString()]) {
								bydates[selected.toString()].push(detail);
							} else {
								bydates[selected.toString()] = [detail];
							}
							bydates = bydates;
							invalidateView();
							addTimePopOverOpen = false;
						}}
						method="add"
						selected={new Temporal.PlainTime(9, 0, 0)}
						selected2={new Temporal.PlainTime(17, 0, 0)}
					/>
				</Popover.Content>
			</Popover.Root>
		</div>
		<ul class="flex flex-col gap-y-2">
			{#if bydates[selected.toString()]}
				{#each bydates[selected.toString()] as { id, date, startTime: startAt, duration, userId, user }}
					{@const [hour, minute] = startAt?.split(':').map((v) => +v)}
					{@const startTime = new Temporal.PlainTime(hour, minute)}
					{@const formattedStartTime = startTime.toLocaleString('en-us', {
						hour: '2-digit',
						minute: '2-digit'
					})}
					{@const endTime = new Temporal.PlainTime(hour, minute).add({
						minutes: +`${duration}`
					})}
					{@const formattedEndAt = endTime.toLocaleString('en-us', {
						hour: '2-digit',
						minute: '2-digit'
					})}
					<li class="flex items-center gap-x-2">
						{#if !!!userId}
							<button
								aria-pressed={selectedTimeslot?.id === id}
								on:click={() => {
									selectedTimeslot = {
										id,
										date,
										startTime: startAt,
										duration
									};
								}}
								class="
								flex group
							aria-pressed:bg-layer-13
							aria-pressed:text-layer-0 items-center gap-x-1 px-1.5 py-0.5
							bg-layer-3 rounded-md"
							>
								<span class="whitespace-nowrap tabular-nums">{formattedStartTime}</span>
								<Minus class="bg-layer-6 group-aria-pressed:bg-layer-0" />
								<span class="whitespace-nowrap tabular-nums">{formattedEndAt}</span>
							</button>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<DotsVertical />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end" side="bottom" class="w-32">
									<DropdownMenu.Item
										on:click={() => {
											timePicker.dialog?.showModal();
											timePicker.data = {
												id,
												startTime,
												endTime
											};
										}}>Update</DropdownMenu.Item
									>
									<DropdownMenu.Item
										on:click={async () => {
											// const res = await db
											// 	.delete(appointment)
											// 	.where(eq(appointment.id, id))
											// 	.returning();
											const index = bydates[selected.toString()].findIndex((d) => d.id === id);
											if (index !== -1) {
												bydates[selected.toString()].splice(index, 1);
												bydates = bydates;
												invalidateView();
											}
										}}>Delete</DropdownMenu.Item
									>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{:else}
							<div class="bg-layer-3 flex flex-col px-1.5 py-0.5 gap-y-1 rounded-xl">
								<div class="flex items-center">
									<Avatar.Root class="shrink-0 inline">
										<Avatar.Image src={user.image} alt={user.username} />
										<Avatar.Fallback>A</Avatar.Fallback>
									</Avatar.Root>
									<div class="whitespace-nowrap grow w-0 px-1 overflow-auto">
										{user.name}
									</div>
								</div>
								<div class="flex items-center">
									<span class="whitespace-nowrap tabular-nums">{formattedStartTime}</span>
									<Minus class="bg-layer-6 group-aria-pressed:bg-layer-0" />
									<span class="whitespace-nowrap tabular-nums">{formattedEndAt}</span>
								</div>
								<div class="inline-flex gap-x-1">
									<span>{user.phone_number}</span>
									{#if user.phone_number_verified}
										<Check />
									{/if}
								</div>
							</div>
						{/if}
					</li>
				{/each}
			{/if}
			<li>
				<button
					class="flex group aria-pressed:bg-layer-13 aria-pressed:text-layer-0 items-center gap-x-1 px-1.5 py-0.5 bg-layer-3 rounded-md invisible"
				>
					<span class="whitespace-nowrap tabular-nums">12:00 PM</span>
					<Minus class="bg-layer-6 group-aria-pressed:bg-layer-0" />
					<span class="whitespace-nowrap tabular-nums">01:00 PM</span>
				</button>
			</li>
		</ul>
	</div>
	<div class="absolute right-4 bottom-4">
		{#if selectedTimeslot?.id}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<button
						class="inline-flex gap-x-1 items-center bg-layer-6 hover:bg-layer-7 rounded-md px-2 py-1"
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
						Book <ArrowRight class="w-4 h-4" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Add a User to This Select TimeSlot</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}
	</div>
</div>
<dialog class="bg-transparent" bind:this={timePicker.dialog}>
	<div
		class="z-50 w-max border text-popover-foreground bg-layer-0 shadow-md outline-none flex flex-col h-[267px] rounded-lg gap-y-2"
	>
		<TimePicker
			{osteopathId}
			method="update"
			day={selected.toString()}
			on:cancel={() => timePicker?.dialog?.close()}
			appointmentId={timePicker.data.id}
			on:load={({ detail }) => {
				console.log('Triggered UPDATED Completed', detail);
				if (bydates[selected.toString()]) {
					const index = bydates[selected.toString()].findIndex((e) => e.id === timePicker.data.id);
					bydates[selected.toString()][index] = detail;
					bydates = bydates;
				}
				if (detail) {
					timePicker?.dialog?.close();
				}
			}}
			selected={timePicker.data?.startTime || new Temporal.PlainTime(9, 0, 0)}
			selected2={timePicker.data?.endTime || new Temporal.PlainTime(17, 0, 0)}
		/>
	</div>
</dialog>
