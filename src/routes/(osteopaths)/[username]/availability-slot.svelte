<script lang="ts">
	import { fade } from 'svelte/transition';
	import { PlusCircled, Trash } from 'radix-icons-svelte';
	import { config, divideTimeIntoX } from './utils';
	import { fromTimeStr } from './utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { createPress } from 'svelte-interactions';
	import { onMount } from 'svelte';
	const { pressAction } = createPress();

	let container: HTMLElement;

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

	export let day: string;
	export let startTime = config.startTime;
	export let endTime = config.endTime;
	export let minGap = config.minGap;
	let [view, unit] = divideTimeIntoX(startTime, endTime, minGap);
	let adding = false;
	let updated = false;

	let pointer: HTMLElement;
	let pointerX = 0;
	let pointerVisible = false;
	onMount(() => {
		container.addEventListener('mouseenter', () => {
			pointerVisible = true;
			container.addEventListener(
				'mouseleave',
				() => {
					pointerVisible = false;
				},
				{
					passive: true,
					once: true
				}
			);
			container.addEventListener('mousemove', (event) => {
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
			},{
				passive: true,
			});
		},{
			passive: true,
		});
	});
</script>

<div class="relative w-full overflow-auto pb-4">
	<button
		type="button"
		on:click={(e) => {
			e.preventDefault();
			const rect = container.getBoundingClientRect();
			const endX = rect.width;
			const startX = 0;
			const newX = endX < e.x - rect.x ? endX : startX > e.x - rect.x ? startX : e.x - rect.x;
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
		tabindex={0}
		bind:this={container}
		class="relative flex h-12 w-full min-w-[864px] shrink rounded-md border-2 border-indigo-600 bg-indigo-200 pb-4"
	>
		{#if pointerVisible}
			<div
				transition:fade={{ duration: 100, delay: 0 }}
				bind:this={pointer}
				style:left="{pointerX}%"
				style:width="{unit}%"
				class="absolute flex h-full items-center justify-center rounded-md border bg-indigo-400"
			>
				<PlusCircled class="text-white" />
			</div>
		{/if}
		{#each markedPointers as marked (marked.start.x)}
			<div
				style:left="{marked.start.x}%"
				style:right="{100 - marked.end.x}%"
				bind:this={marked.element}
				class="@container group absolute flex h-full items-center justify-center rounded-md border bg-indigo-500"
			>
				{#if marked.element?.offsetWidth > 120}
					<div
						class="@[6rem]:text-sm @[12rem]:text-lg @xs:text-xl absolute flex w-full items-center justify-center text-xs text-white group-hover:hidden"
					>
						{marked.start.time + ' - ' + marked.end.time}
					</div>
				{/if}
				<button
					type="button"
					on:click={(e) => {
						e.stopPropagation();
						const i = markedPointers.findIndex(
							(point) =>
								point.start.time === marked.start.time && point.end.time === marked.end.time
						);
						markedPointers = markedPointers.toSpliced(i, 1);
						updated = true;
					}}
					class="rounded-md bg-white/10 p-1 opacity-0 hover:bg-rose-400 group-hover:opacity-100"
				>
					<Trash class="text-indigo-950" />
				</button>
			</div>
		{/each}
	</button>
	<div class="relative min-w-[864px] shrink text-xs">
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
		on:click={async () => {
			console.log('ADDING');
			adding = true;
			await fetch('/availability', {
				method: 'PUT',
				body: JSON.stringify({
					day: day,
					markedPointers
				})
			});
			adding = false;
			updated = false;
		}}
		disabled={adding}>{adding ? 'Saving' : 'Save'}</Button
	>
{/if}
