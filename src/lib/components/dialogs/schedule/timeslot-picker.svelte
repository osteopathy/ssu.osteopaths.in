<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { DotsVertical, Minus } from 'radix-icons-svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { Temporal } from 'temporal-polyfill';

	const dispatch = createEventDispatcher();

	export let editable = false;

	export let bydate: {
		duration: string;
		id: string;
		date: string;
		startTime: string;
		osteopathId: string;
		userId: string | null;
		user: any;
	}[];

	export let selected: {
		id: string;
		date: string;
		startTime: string;
		duration: string;
	} | null;
	onMount(() => {
		console.log(bydate);
	});
</script>

<ul class="flex flex-col gap-y-2">
	{#if bydate}
		{#each bydate as { id, date, startTime, duration, userId, user }}
			{@const [hour, minute] = startTime?.split(':').map((v) => +v)}
			{@const formattedStartTime = new Temporal.PlainTime(hour, minute).toLocaleString('en-us', {
				hour: '2-digit',
				minute: '2-digit'
			})}
			{@const formattedEndAt = new Temporal.PlainTime(hour, minute)
				.add({
					minutes: +`${duration}`
				})
				.toLocaleString('en-us', {
					hour: '2-digit',
					minute: '2-digit'
				})}
			{#if user}
				<li class="flex flex-col">
					<div class="flex gap-x-2">
						<Avatar.Root class="size-12">
							<Avatar.Image src={user.image} alt="@" />
							<Avatar.Fallback>{user.name}</Avatar.Fallback>
						</Avatar.Root>
						<div class="max-w-32 overflow-auto">
							<h3>{user.name}</h3>
							<div class="flex items-center text-sm">
								<span class="whitespace-nowrap tabular-nums"
									>{formattedStartTime.split(' ')[0]}</span
								>
								<Minus />
								<span class="whitespace-nowrap tabular-nums">{formattedEndAt}</span>
							</div>
						</div>
					</div>
				</li>
			{:else}
				<li class="flex items-center {editable && 'gap-x-2'}">
					<button
						aria-pressed={selected?.id === id}
						on:click={() => {
							selected = {
								id,
								date,
								startTime,
								duration
							};
						}}
						disabled={userId !== null}
						class="
				disabled:text-muted-foregound group
				flex items-center
				gap-x-1 rounded-md border bg-muted px-1.5 py-0.5 disabled:bg-muted
				aria-pressed:bg-blue-500 aria-pressed:text-white"
					>
						<span class="whitespace-nowrap tabular-nums">{formattedStartTime}</span>
						<Minus />
						<span class="whitespace-nowrap tabular-nums">{formattedEndAt}</span>
					</button>
					{#if editable}
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<DotsVertical />
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end" side="bottom" class="w-32">
								<DropdownMenu.Item
									on:click={() => dispatch('update', { id, date, startTime, duration })}
								>
									Update
								</DropdownMenu.Item>
								<DropdownMenu.Item
									on:click={() => dispatch('delete', { id, date, startTime, duration })}
								>
									Delete
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{/if}
				</li>
			{/if}
		{/each}
	{:else}
		<li class="flex items-center gap-x-2">
			<div class="h-[30px] w-[180.66px]"></div>
			<div class="h-[15px] w-[15px]"></div>
		</li>
	{/if}
</ul>

<!-- 
const res = await db
	.delete(appointment)
	.where(eq(appointment.id, id))
	.returning();

const index = bydates[selected.toString()].findIndex((d) => d.id === id);

if (index !== -1) {
	bydates[selected.toString()].splice(index, 1);
	bydates = bydates;
	invalidateView();
} 
-->
