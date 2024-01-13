<script lang="ts">
	import { fade } from 'svelte/transition';
	import { PlusCircleIcon, TrashIcon } from '$lib/ui/icons';
	import { config, divideTimeIntoX } from './utils';
	import { fromTimeStr } from './utils';
	import Button from '$lib/ui/Button.svelte';
	import { invalidate } from '$app/navigation';

	let container: HTMLElement;
	let pointer: HTMLElement;
	let pointerX = 0;
	let pointerVisible = false;

	export let markedPointers: {
		id?: number;
		start: {
			x: number;
			time: string;
		};
		end: {
			x: number;
			time: string;
		};
		element: HTMLElement | null;
	}[] = [];

	export let day;
	export let startTime = config.startTime;
	export let endTime = config.endTime;
	export let minGap = config.minGap;
	let [view, unit] = divideTimeIntoX(startTime, endTime, minGap);
	let adding = false;
	let updated = false;
</script>

<div class="w-full relative overflow-auto pb-4">
	<div
		on:pointermove={(event) => {
			const rect = container.getBoundingClientRect();
			const endX = rect.width - pointer.offsetWidth;
			const startX = 0;
			const newX =
				endX < event.x - rect.x ? endX : startX > event.x - rect.x ? startX : event.x - rect.x;
			const start = Math.ceil((newX / rect.width) * 100);
			const i = view.findIndex(({ x }) => {
				return x > start;
			});
			pointerX = view[i - 1].x - 0.05;
		}}
		on:focus={() => {}}
		on:blur={() => {}}
		role="button"
		tabindex={0}
		bind:this={container}
		on:pointerenter={() => {
			pointerVisible = true;
		}}
		on:pointerleave={() => {
			pointerVisible = false;
		}}
		class="h-12 relative w-full pb-4 shrink min-w-[864px] bg-indigo-200 border-2 border-indigo-600 rounded-md"
	>
		{#if pointerVisible}
			<button
				transition:fade={{ duration: 100, delay: 0 }}
				type="button"
				bind:this={pointer}
				style:left="{pointerX}%"
				style:width="{unit}%"
				on:click={(event) => {
					const rect = container.getBoundingClientRect();
					const endX = rect.width - pointer.offsetWidth;
					const startX = 0;
					const newX =
						endX < event.x - rect.x ? endX : startX > event.x - rect.x ? startX : event.x - rect.x;
					const newStartX = Math.ceil((newX / rect.width) * 100);
					const i = view.findIndex(({ x }) => {
						return x > newStartX;
					});
					// for view obj
					const start = view[i - 1];
					const end = view[i];
					let added = null;
					let temp = [];
					for (let index = 0; index < markedPointers.length; index++) {
						const marked = markedPointers[index];
						const next = markedPointers[index + 1];
						const markedEndTime = fromTimeStr(marked.end.time);
						const markedStartTime = fromTimeStr(marked.start.time);
						if (next) {
							const nextStartTime = fromTimeStr(next.start.time);
							const nextEndTime = fromTimeStr(next.end.time);
							if (markedEndTime.equals(start.time) && nextStartTime.equals(end.time)) {
								added = true;
								marked.end = next.end;
								index++;
							}
							if (markedStartTime.equals(end.time) && nextEndTime.equals(start.time)) {
								added = true;
								marked.start = next.start;
								index++;
							}
						} else {
							if (markedEndTime.equals(start.time) && !added) {
								added = true;
								marked.end = {
									x: end.x,
									time: end.time.toLocaleString('en', {
										hour: '2-digit',
										minute: '2-digit',
										hour12: false
									})
								};
							}
							if (markedStartTime.equals(end.time) && !added) {
								added = true;
								marked.start = {
									x: start.x,
									time: start.time.toLocaleString('en', {
										hour: '2-digit',
										minute: '2-digit',
										hour12: false
									})
								};
							}
						}
						temp.push(marked);
					}
					updated = true;
					if (added) {
						markedPointers = [...temp];
					} else {
						markedPointers = [
							...temp,
							{
								start: {
									x: start.x,
									time: start.time.toLocaleString('en', {
										hour: '2-digit',
										minute: '2-digit',
										hour12: false
									})
								},
								end: {
									x: end.x,
									time: end.time.toLocaleString('en', {
										hour: '2-digit',
										minute: '2-digit',
										hour12: false
									})
								},
								element: null
							}
						];
					}
				}}
				class="absolute h-full rounded-md bg-indigo-400 border flex items-center justify-center"
			>
				<PlusCircleIcon class="text-white" />
			</button>
		{/if}
		{#each markedPointers as marked (marked.start.x)}
			<div
				style:left="{marked.start.x}%"
				style:right="{100 - marked.end.x}%"
				bind:this={marked.element}
				class="absolute h-full rounded-md bg-indigo-500 border flex group items-center justify-center @container"
			>
				{#if marked.element?.offsetWidth > 120}
					<div
						class="flex items-center justify-center text-white w-full group-hover:hidden absolute @[6rem]:text-sm text-xs @[12rem]:text-lg @xs:text-xl"
					>
						{marked.start.time + ' - ' + marked.end.time}
					</div>
				{/if}
				<button
					on:click={() => {
						const i = markedPointers.findIndex(
							(point) =>
								point.start.time === marked.start.time && point.end.time === marked.end.time
						);
						markedPointers = markedPointers.toSpliced(i, 1);
						updated = true;
					}}
					class="p-1 bg-white/10 hover:bg-rose-400 group-hover:opacity-100 opacity-0 rounded-md"
				>
					<TrashIcon class="text-indigo-950" />
				</button>
			</div>
		{/each}
	</div>
	<div class="relative text-xs shrink min-w-[864px]">
		{#each view as { x, time }, i}
			<div class="absolute w-max" style:left="{time.hour === endTime ? x - 1.2 : x}%">
				{#if time.hour === endTime}
					{endTime % 12}
				{:else if time.minute === 0}
					{time.toLocaleString('en', { hour: 'numeric' })}
				{:else}
					{time.minute}
				{/if}
			</div>
		{/each}
	</div>
</div>
{#if updated}
	<Button
		class="mt-6"
		size="sm"
		onclick={async () => {
			console.log('ADDING');
			adding = true;
			await fetch('/api/availability', {
				method: 'PUT',
				body: JSON.stringify({
					day: day,
					markedPointers
				})
			});
			adding = false;
			updated = false;
			invalidate('availabilities');
		}}
		disabled={adding}>{adding ? 'Saving' : 'Save'}</Button
	>
{/if}
