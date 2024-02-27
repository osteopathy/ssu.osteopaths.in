<script lang="ts" context="module">
	export interface BubbleMenuItem {
		title: string;
		isActive: (editor: Editor) => boolean;
		action: (editor: Editor) => void;
		Icon: typeof BoldIcon;
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Editor } from '@tiptap/core';
	import {
		FontBold as BoldIcon,
		Code as Code2Icon,
		FontItalic as ItalicIcon,
		Strikethrough as StrikethroughIcon,
		Underline as UnderlineIcon
	} from 'radix-icons-svelte';
	import { writable } from 'svelte/store';
	import LinkSelector from './link-selector.svelte';
	import NodeSelector from './node-selector.svelte';
	import { BubbleMenuPlugin, type BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
	import { onDestroy, onMount } from 'svelte';

	let element: HTMLElement;

	let isNodeSelectorOpen = writable(false);
	let isLinkSelectorOpen = writable(false);

	export let editor: Editor;
	export let tippyOptions: BubbleMenuPluginProps['tippyOptions'] = {
		moveTransition: 'transform 0.15s ease-out',
		onHidden: () => {
			isNodeSelectorOpen.set(false);
			isLinkSelectorOpen.set(false);
		}
	};
	export let pluginKey: BubbleMenuPluginProps['pluginKey'] = 'SvelteTiptapBubbleMenu';
	export let shouldShow: BubbleMenuPluginProps['shouldShow'] = ({ editor }) => {
		// don't show if image is selected
		if (editor.isActive('image')) {
			return false;
		}
		return editor.view.state.selection.content().size > 0;
	};
	export let updateDelay: BubbleMenuPluginProps['updateDelay'] = 250;

	const items: BubbleMenuItem[] = [
		{
			Icon: BoldIcon,
			title: 'Bold',
			action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
			isActive: (editor: Editor) => editor.isActive('bold')
		},
		{
			Icon: ItalicIcon,
			title: 'Italic',
			action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
			isActive: (editor: Editor) => editor.isActive('italic')
		},
		{
			Icon: StrikethroughIcon,
			title: 'Strike',
			action: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
			isActive: (editor: Editor) => editor.isActive('strike')
		},
		{
			Icon: Code2Icon,
			title: 'Code',
			action: (editor: Editor) => editor.chain().focus().toggleCode().run(),
			isActive: (editor: Editor) => editor.isActive('code')
		}
	];

	const reset = () => {
		isNodeSelectorOpen.set(false);
		isLinkSelectorOpen.set(false);
	};

	$: if (!$isNodeSelectorOpen) {
		reset();
	}

	$: if (!$isLinkSelectorOpen) {
		reset();
	}

	if (!editor) {
		throw new Error('Missing editor instance.');
	}

	onMount(() => {
		const plugin = BubbleMenuPlugin({
			pluginKey,
			editor,
			element,
			tippyOptions,
			shouldShow,
			updateDelay
		});

		editor.registerPlugin(plugin);
	});

	onDestroy(() => {
		editor.unregisterPlugin(pluginKey);
	});
</script>

<div
	bind:this={element}
	class="divide-layer-6 border-layer-6 flex w-fit divide-x rounded border bg-white shadow-xl"
>
	{#if !editor.isActive('title') && !editor.isActive('summary')}
		<NodeSelector {editor} bind:isOpen={$isNodeSelectorOpen} />
	{/if}
	<LinkSelector {editor} bind:isOpen={$isLinkSelectorOpen} />
	<div class="flex">
		{#each items as { Icon, action, isActive, title }, index (index)}
			<button
				{title}
				on:click={() => action(editor)}
				class="text-layer-10 hover:bg-layer-3 active:bg-layer-4 p-2"
				type="button"
			>
				<Icon
					class={cn('h-4 w-4', {
						'text-blue-500': isActive(editor)
					})}
				/>
			</button>
		{/each}
	</div>
	<!-- <ColorSelector {editor} bind:isOpen={$isColorSelectorOpen} /> -->
</div>
