<script lang="ts">
	import { Temporal } from 'temporal-polyfill';
	import * as Popover from '$lib/components/ui/popover';
	import * as Dialog from '$lib/components/ui/dialog';
	import DatePicker from './date-picker.svelte';
	import TimeSlotPicker from './timeslot-picker.svelte';
	import TimePicker from './time-picker.svelte';
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, PlusCircled } from 'radix-icons-svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { createAppointment } from '../../../../routes/(api)/appointment';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		book: {
			id: string;
			date: string;
			startTime: string;
			duration: string;
		};
	}>();

	export let open = false;
	// editable will make it possible to edit schedule
	export let editable = true;

	// popover is for time picker
	let popover = false;

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
	> = {};

	const now = Temporal.Now.plainDateISO();

	let [year, month, day] =
		Object.keys(bydates).length !== 0
			? Object.keys(bydates)[0]
					.split('-')
					.map((v) => +`${v}`)
			: [now.year, now.month, now.day];

	let selected = [new Temporal.PlainDate(year, month, day)];
	let bydate = bydates[selected[0].toString()] ? bydates[selected[0].toString()] : [];

	let timeslot: {
		id: string;
		date: string;
		startTime: string;
		duration: string;
	} | null = null;

	let loading = 'idle';
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-[92%] max-w-fit overflow-auto">
		<Dialog.Header>
			<Dialog.Title>{editable ? 'Edit' : 'Book'} Appointment{editable ? 's' : ''}</Dialog.Title>
			<Dialog.Description
				>You can {editable ? 'edit' : 'choose'} a date, and select time.</Dialog.Description
			>
		</Dialog.Header>
		<div class="relative flex flex-col sm:flex-row">
			<DatePicker
				{editable}
				bind:bydates
				bind:selected
				on:select={(e) => {
					if (e.detail.changed) timeslot = null;
					bydate = e.detail.bydate;
				}}
			/>
			<div
				class="xs:p-3 rounded-b-lg border-2 border-layer-6 p-2 sm:rounded-r-lg sm:rounded-bl-none sm:p-4"
			>
				<div class="mb-3 flex w-full items-center justify-between gap-x-2">
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
					{#if editable}
						<Popover.Root bind:open={popover}>
							<Popover.Trigger
								class={buttonVariants({
									variant: 'outline',
									size: 'sm',
									class: 'h-7 items-center gap-x-2 px-2'
								})}
							>
								<PlusCircled class="h-4 w-4" /> <span class="whitespace-nowrap">Add</span>
							</Popover.Trigger>
							<Popover.Content
								class="flex h-[267px] w-max flex-col gap-y-2 rounded-lg bg-background p-0"
							>
								<TimePicker
									loading={loading === 'create-appointment'}
									on:cancel={() => (popover = false)}
									on:submit={async (e) => {
										loading = 'create-appointment';
										const res = await createAppointment({
											osteopathId: $page.data.osteopath.id,
											date: selected[0].toString(),
											startTime: e.detail.startTime,
											duration: e.detail.duration
										});
										if (bydates[selected.toString()]) {
											bydates[selected.toString()].push({ user: null, ...res.data });
										} else {
											bydates[selected.toString()] = [{ user: null, ...res.data }];
										}
										bydates = bydates;
										selected = selected;
										bydate = bydates[selected[0].toString()] ? bydates[selected[0].toString()] : [];
										loading = 'idle';
										setTimeout(() => {
											popover = false;
										}, 300);
									}}
								/>
							</Popover.Content>
						</Popover.Root>
					{/if}
				</div>
				<TimeSlotPicker {editable} bind:selected={timeslot} {bydate} />
			</div>
			<div class="absolute bottom-4 right-4">
				{#if timeslot?.id}
					<div
						transition:fly={{
							delay: 50,
							duration: 300,
							y: 10,
							opacity: 0,
							easing: quintInOut
						}}
					>
						<Button
							size="sm"
							on:click={() => {
								if (timeslot) {
									dispatch('book', timeslot);
								}
							}}
						>
							Book <ArrowRight class="h-4 w-4" />
						</Button>
					</div>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
