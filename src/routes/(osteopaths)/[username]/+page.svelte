<script lang="ts">
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import Calendar from './calendar.svelte';
	import { Temporal } from 'temporal-polyfill';
	import { Minus } from 'radix-icons-svelte';

	export let data;
	let image = data.osteopath.user?.image;
	let open = false;
	let selectedDate = Temporal.Now.plainDateISO();
	let selectedTime = {
		date: '',
		startTime: '',
		endTime: ''
	};
	function getAvailableSlots(
		from: { hour: number; minute: number },
		to: { hour: number; minute: number }
	) {
		let temp = new Temporal.PlainTime(from.hour, from.minute);
		const stop = new Temporal.PlainTime(to.hour, to.minute);
		const slots = [];
		while (stop.until(temp).sign === -1) {
			slots.push([
				temp.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', hour12: false }),
				temp.add({ minutes: 30 }).toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', hour12: false })
			]);
			temp = temp.add({ minutes: 30 });
		}
		return slots
	}
</script>

<main class="flex w-full max-w-5xl flex-col items-center p-4">
	<div class="flex w-max flex-col">
		<Avatar.Root class="size-32">
			<Avatar.Image src={image} alt="@" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
		<div class="mt-6 flex w-80 flex-col">
			<h2 class="mb-1">{data.osteopath.user.name}</h2>
			<span class="mb-2 text-muted-foreground">{data.osteopath?.course?.label}</span>
			{#if data.osteopath?.about}
				<p>{data.osteopath?.about}</p>
			{/if}
		</div>
		<div class="mt-6 flex w-full">
			{#if data.isCurrentUser}
				<Button
					size="responsive"
					on:click={() => {
						navigator.clipboard.writeText(`https://ssu.osteopaths.in/${$page.params.username}`);
						toast.info('URL COPIED!');
					}}
				>
					Copy URL
				</Button>
				<div class="mr-4 border-r-2 px-2"></div>
				<Button variant="outline" size="responsive" href="/{$page.params.username}/edit">
					Edit
				</Button>
			{:else}
				<Button on:click={() => (open = !open)} size="responsive">Book Appointment</Button>
			{/if}
		</div>
	</div>
</main>
<div class="relative flex flex-col sm:flex-row">
	<Calendar bind:selected={selectedDate} availabilities={data.availabilities} />
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
				{@const slots = getAvailableSlots({
					hour: startHour,
					minute: startMinute
				},{
					hour: endHour,
					minute: endMinute
				})}
				{#each slots as slot}
					<li class="flex items-center gap-x-2">
						<button
							aria-pressed={selectedTime.date + selectedTime.startTime + selectedTime.endTime === selectedDate.toString() + slot[0] + slot[1]}
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
	</div>
</div>
