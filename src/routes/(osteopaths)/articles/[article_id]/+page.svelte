<script lang="ts">
	import { defaultExtensions } from '$lib/components/editor/extensions/index.js';
	import { generateHTML } from '@tiptap/html';
	import { onMount } from 'svelte';

	let output = '';

	onMount(() => {
		if(data.article?.content) output = generateHTML(data.article?.content, defaultExtensions);
	});

	export let data;
</script>

<main class="flex flex-col w-full relative p-6 max-w-5xl mt-8">
	<div class="prose max-w-none dark:prose-invert">
		{@html output}
	</div>
</main>
