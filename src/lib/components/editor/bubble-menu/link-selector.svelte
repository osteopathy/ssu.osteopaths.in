<script lang="ts">
	import { anyify, cn, getUrlFromString } from '$lib/utils/index';
	import type { Editor } from '@tiptap/core';
	import { Check, Trash } from 'radix-icons-svelte';

	export let editor: Editor;
	export let isOpen: boolean;

	let inputRef: HTMLInputElement | null;
</script>

<div class="relative">
	<button
		type="button"
		class="text-layer-11 hover:bg-layer-3 active:bg-layer-4 flex h-full items-center space-x-2 px-3 py-1.5 text-sm font-medium"
		on:click={() => {
			isOpen = !isOpen;
		}}
	>
		<p class="text-base">↗</p>
		<p
			class={cn('decoration-layer-6 underline underline-offset-4', {
				'text-blue-500': editor.isActive('link')
			})}
		>
			Link
		</p>
	</button>
	{#if isOpen}
		<form
			on:submit={(e) => {
				e.preventDefault();
				const input = anyify(e.target)[0];
				const url = getUrlFromString(input.value);
				url && editor.chain().focus().setLink({ href: url }).run();
				isOpen = false;
			}}
			class="border-layer-3 animate-in fade-in slide-in-from-top-1 fixed top-full z-[99999] mt-1 flex w-60 overflow-hidden rounded border bg-white p-1 shadow-xl"
		>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				autofocus
				bind:this={inputRef}
				type="text"
				placeholder="Paste a link"
				class="bg-layer-0 flex-1 p-1 text-sm outline-none"
				value={editor.getAttributes('link').href || ''}
			/>
			{#if editor.getAttributes('link').href}
				<button
					type="button"
					class="flex items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
					on:click={() => {
						editor.chain().focus().unsetLink().run();
						isOpen = false;
					}}
				>
					<Trash class="h-4 w-4" />
				</button>
			{:else}
				<button
					class="text-layer-7 hover:bg-layer-3 flex items-center rounded-sm p-1 transition-all"
				>
					<Check class="h-4 w-4" />
				</button>
			{/if}
		</form>
	{/if}
</div>
