<script lang="ts">
	import type { CommandItemProps } from './slash-command.js';
	import { anyify } from '$lib/utils';

	export let items: CommandItemProps[] = [];
	export let command: any;

	let selectedIndex = 0;

	const selectItem = (index: number) => {
		const item = items[index];
		if (item) {
			command(item);
		}
	};

	const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];
	const onKeyDown = (e: KeyboardEvent) => {
		if (!navigationKeys.includes(e.key)) return;
		e.preventDefault();
		if (e.key === 'ArrowUp') {
			selectedIndex = (selectedIndex + items.length - 1) % items.length;
		} else if (e.key === 'ArrowDown') {
			selectedIndex = (selectedIndex + 1) % items.length;
		} else if (e.key === 'Enter') {
			selectItem(selectedIndex);
		}

		const item = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
		if (item)
			item.scrollIntoView({
				block: 'nearest'
			});
	};

	let container: HTMLElement;
</script>

<svelte:window on:keydown={onKeyDown} />

{#if items.length > 0}
	<div
		id="slash-command"
		class="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-layer-4 bg-white px-1 py-2 shadow-md transition-all"
		bind:this={container}
	>
		{#each items as item, index (index)}
			<button
				class="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-layer-12 hover:bg-layer-3 scroll-my-2 {index ===
				selectedIndex
					? 'bg-layer-3 text-layer-12'
					: ''} "
				on:click={() => selectItem(index)}
				data-index={index}
				type="button"
			>
				<div
					class="flex h-10 w-10 items-center justify-center rounded-md border border-layer-4 bg-white"
				>
					<svelte:component this={anyify(item.icon)} size="18" />
				</div>
				<div>
					<p class="font-medium">{item.title}</p>
					<p class="text-xs text-layer-10">{item.description}</p>
				</div>
			</button>
		{/each}
	</div>
{/if}
