<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolveRoute } from '$app/paths';
	import { page } from '$app/stores';
	import { defaultExtensions } from '$lib/components/editor/extensions/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { generateHTML } from '@tiptap/html';
	import { PenIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let output = '';

	onMount(() => {
		if(data.article?.content) output = generateHTML(data.article?.content, defaultExtensions);
	});

	const r = resolveRoute('/[username]/articles/[article_id]/edit', {
		article_id: $page.params.article_id,
        username: $page.params.username
	});
	export let data;
</script>

<main class="flex flex-col w-full relative p-6 max-w-5xl mt-8">
	<div class="flex justify-between">
		<div></div>
		{#if data.osteopath?.id === data.article?.author_id}
			<Button on:click={() => goto(r)} class="flex gap-x-2">
				<span>Edit</span>
				<span><PenIcon size={16} /></span>
			</Button>
		{/if}
	</div>
	<div class="prose max-w-none">
		{@html output}
	</div>
</main>
