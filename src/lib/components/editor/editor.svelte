<script lang="ts">
	import './codemirror.css';
	import { onDestroy, onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { menuItems } from './state';
	import type { EditorProps } from '@tiptap/pm/view';
	import { startImageUpload } from './plugins/upload-images.js';
	import { createDebouncedCallback, createLocalStorageStore, noop } from '$lib/utils/index';
	import { Button } from '$lib/components/ui/button';
	let className =
		'flex w-full relative flex-col p-6 border border-layer-4 shadow-sm shadow-layer-3 rounded-lg';
	export { className as class };
	/**
	 * A callback function that is called whenever the editor is updated.
	 * Defaults to () => {}.
	 */
	export let onUpdate: (editor?: Editor) => void | Promise<void> = noop;
	/**
	 * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
	 * Defaults to () => {}.
	 */
	export let onDebouncedUpdate: (editor?: Editor) => void | Promise<void> = noop;
	/**
	 * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
	 * Defaults to 750.
	 */
	export let debounceDuration = 750;
	/**
	 * The key to use for storing the editor's value in local storage.
	 * Defaults to "editor_state".
	 */
	export let storageKey = 'editor__state';
	export let defaultValue = '#Hello World';

	let element: HTMLElement;
	let editor: Editor;

	const defaultEditorProps: EditorProps = {
		attributes: {
			class: `prose sm:prose-lg prose-zinc dark:prose-invert focus:outline-none max-w-full`
		},
		handleDOMEvents: {
			keydown: (_view, event) => {
				// prevent default event listeners from firing when slash command is active
				if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
					const slashCommand = document.querySelector('#slash-command');
					if (slashCommand) {
						return true;
					}
				}
			}
		},
		handlePaste: (view, event) => {
			if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
				event.preventDefault();
				const file = event.clipboardData.files[0];
				const pos = view.state.selection.from;
				startImageUpload(file, view, pos);
				return true;
			}
			return false;
		},
		handleDrop: (view, event, _slice, moved) => {
			if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
				event.preventDefault();
				const file = event.dataTransfer.files[0];
				const coordinates = view.posAtCoords({
					left: event.clientX,
					top: event.clientY
				});
				// here we deduct 1 from the pos or else the image will create an extra node
				startImageUpload(file, view, coordinates?.pos || 0 - 1);
				return true;
			}
			return false;
		}
	};

	const content = createLocalStorageStore(storageKey, defaultValue);

	let hydrated = false;

	$: if (editor && $content && !hydrated) {
		editor.commands.setContent($content);
		hydrated = true;
	}

	const debouncedUpdates = createDebouncedCallback(async ({ editor }) => {
		const json = editor.getJSON();
		content.set(json);
		onDebouncedUpdate(editor);
	}, debounceDuration);

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: defaultExtensions,
			editorProps: defaultEditorProps,
			content: '# Hello World! 🌍️',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onUpdate: (e) => {
				onUpdate(e.editor);
				debouncedUpdates(e);
			},
			autofocus: 'end'
		});
		return () => editor.destroy();
	});
	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
	import EditorBubbleMenu from '$lib/components/editor/bubble-menu/index.svelte';
	import { defaultExtensions } from './extensions';
</script>

<div class={className}>
	<div
		class="flex items-center gap-2 rounded-lg flex-wrap bg-layer-0 p-2 border border-layer-2 shadow-sm z-10"
	>
		{#if editor}
			{#each menuItems as { Icon, title, action, isActive }}
				{#if Icon}
					<Button
						{title}
						size="icon"
						on:click={() => action && action(editor)}
						variant={isActive && isActive(editor) ? 'default' : 'secondary'}
						class="w-7 h-7 p-1 rounded-md"
					>
						<Icon />
					</Button>
				{:else}
					<div>|</div>
				{/if}
			{/each}
		{/if}
	</div>
	<div class="mt-6 relative px-1">
		<div bind:this={element} />
	</div>
	<slot />
</div>

{#if editor && editor.isEditable}
	<EditorBubbleMenu {editor} />
{/if}

<style lang="postcss">
	button.active {
		@apply bg-black text-white;
	}

	:global(html) {
		background-color: rgb(var(--layer-0));
	}
</style>
