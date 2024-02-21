<script lang="ts">
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import Calendar from './calendar.svelte';
	import { Temporal } from 'temporal-polyfill';
	import { ArrowRight, Minus, Plus } from 'radix-icons-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { fade, fly } from 'svelte/transition';
	import { flyAndScale } from '$lib/utils';
	import AvailabilityPanel from './edit/availability-panel.svelte';
	import { quintInOut } from 'svelte/easing';

	export let data;
	let image = data.osteopath.user?.image;
	let open = false;
	let selectedDate = Temporal.Now.plainDateISO().add({days: 1});
	let selectedTime: {
		date: string;
		startTime: string;
		endTime: string;
	} | null = null;
	function getAvailableSlots(
		from: { hour: number; minute: number },
		to: { hour: number; minute: number }
	) {
		let start = new Temporal.PlainTime(from.hour, from.minute);
		const end = new Temporal.PlainTime(to.hour, to.minute);
		const slots = [];
		while (end.until(start).sign === -1) {
			slots.push([
				start.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', hour12: false }),
				start
					.add({ minutes: 30 })
					.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', hour12: false })
			]);
			start = start.add({ minutes: 30 });
		}
		return slots;
	}
</script>

<main class="flex w-full max-w-5xl flex-col items-center p-4">
	<div class="flex flex-col">
		<div class="flex gap-6 flex-col sm:flex-row">
		<Avatar.Root class="size-32">
			<Avatar.Image src={image} alt="@" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
		<div class="flex sm:max-w-80 flex-col">
			<h2 class="mb-1">{data.osteopath.user.name}</h2>
			<span class="mb-2 text-muted-foreground">{data.osteopath?.course?.label}</span>
			{#if data.osteopath?.about}
				<p>{data.osteopath?.about}</p>
			{/if}
		</div>
		</div>
		<div class="mt-6 flex w-full">
			{#if data.isCurrentUser}
				<Dialog.Root>
					<Dialog.Trigger
						class="active:scale-98 bg-foreground-alt hover:bg-foreground-alt/95 inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full px-[21px] text-[15px] font-semibold text-background shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
						asChild
						let:builder
					>
						<button
							use:builder.action
							{...builder}
							class="border-layer-6 bg-layer-1 shadow-layer-5 flex w-max items-center gap-x-2 rounded-full border px-3 py-2 text-left font-medium shadow-inner"
						>
							<div class="bg-layer-3 flex size-10 items-center justify-center rounded-full">
								<Plus />
							</div>
							<div class="flex grow flex-col">
								<h3 class="w-full text-base/6">Update Availability</h3>
								<div class="-mt-1 flex items-center text-sm">
									<span class=""> change </span>
									<span> <ArrowRight class="size-4" /> </span>
								</div>
							</div>
						</button>
					</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Overlay
							transition={fade}
							transitionConfig={{ duration: 150 }}
							class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
						/>
						<Dialog.Content
							transition={flyAndScale}
							class="bg-layer-0 fixed left-[50%] top-[50%] z-50 max-h-[90%] w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-lg border p-5 outline-none sm:max-w-[978px] md:w-full"
						>
							<AvailabilityPanel availabilities={data?.availabilities && data.availabilities} />
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
				<div class="mr-4 border-r-2 px-2"></div>
				<Button variant="outline" size="responsive" href="/{$page.params.username}/edit">
					Edit
				</Button>
			{/if}
		</div>
	</div>
</main>
<div class="relative flex flex-col sm:flex-row">
	<Calendar
		on:change={(e) => {
			selectedTime = null;
		}}
		bind:selected={selectedDate}
		availabilities={data.availabilities}
	/>
	<div
		class="xs:p-3 border-layer-6 rounded-b-lg border-2 p-2 sm:rounded-r-lg sm:rounded-bl-none sm:p-4"
	>
		<div class="mb-3 flex w-full items-center justify-between gap-x-2">
			<h4 class="whitespace-nowrap text-lg font-bold tabular-nums">
				{selectedDate
					.toLocaleString('en-us', {
						day: 'numeric',
						weekday: 'short'
					})
					.split(' ')
					.reverse()
					.join(' ')}
			</h4>
		</div>
		<ul class="flex flex-col gap-y-2">
			<!-- [{"id":"cuy88kbegzzerac","start":{"x":12.5,"time":"10:00"},"end":{"x":37.5,"time":"12:00"}}] -->
			{#each data.availabilities[selectedDate
					.toLocaleString('en', { weekday: 'long' })
					.toLowerCase()] as availability}
				{@const [startHour, startMinute] = availability.start.time?.split(':').map((v) => +v)}
				{@const [endHour, endMinute] = availability.end.time?.split(':').map((v) => +v)}
				<!-- 10:00 - 10:30 10:30 11:00 11:30 11:30 12:00 -->
				{@const slots = getAvailableSlots(
					{
						hour: startHour,
						minute: startMinute
					},
					{
						hour: endHour,
						minute: endMinute
					}
				)}
				{#each slots as slot}
					<li class="flex items-center gap-x-2">
						<button
							aria-pressed={selectedTime !== null && selectedTime.date + selectedTime.startTime + selectedTime.endTime === selectedDate.toString() + slot[0] + slot[1]}
							on:click={() => {
								selectedTime = {
									date: selectedDate.toString(),
									startTime: slot[0],
									endTime: slot[1]
								};
							}}
							class="
						disabled:text-muted-foregound group
						flex items-center
						gap-x-1 rounded-md border bg-muted px-1.5 py-0.5 disabled:bg-muted
						aria-pressed:bg-blue-500 aria-pressed:text-white"
						>
							<span class="whitespace-nowrap tabular-nums">{slot[0]}</span>
							<Minus />
							<span class="whitespace-nowrap tabular-nums">{slot[1]}</span>
						</button>
					</li>
				{/each}
			{/each}
			<li class="flex items-center gap-x-2">
				<div class="h-[30px] w-[180.66px]"></div>
				<div class="h-[15px] w-[15px]"></div>
			</li>
		</ul>
		<div class="absolute bottom-4 right-4">
			{#if selectedTime !== null}
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
							console.log(selectedTime);
							console.log(data.user?.id);
						}}
					>
						Send Request <ArrowRight class="h-4 w-4" />
					</Button>
				</div>
			{/if}
		</div>
	</div>
</div>
