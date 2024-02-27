<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { PlusCircled, Reader } from 'radix-icons-svelte';
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageServerData;
</script>

<main class="w-full max-w-5xl p-4">
	{#if !data?.articles[0]}
		<div class="mt-12 flex flex-col items-center">
			<Reader size={64} />
			<h3 class="text-layer-11 mt-2 font-semibold">No Articles</h3>
			<p class="text-layer-10 mt-1 text-sm">Get started by creating a new article.</p>
			<div class="mt-6">
				<form method="post" use:enhance>
					<input type="hidden" name="osteopath-id" value={data.osteopath.id} />
					<Button type="submit" class="gap-x-1 pl-3" title="Create a Article">
						<PlusCircled size={20} /> New Article
					</Button>
				</form>
			</div>
		</div>
	{:else}
		<div class="mb-12">
			<div class="flex justify-between">
				<h2 class="mb-6 text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl">Articles</h2>
				<form method="post" use:enhance>
					<input type="hidden" name="osteopath-id" value={data.osteopath.id} />
					<Button type="submit" class="gap-x-1 pl-3" title="Create a Article">
						<PlusCircled size={20} /> New Article
					</Button>
				</form>
			</div>
			<p class="text-xl sm:text-2xl md:text-3xl lg:text-4xl">Learn more about Osteopathy</p>
		</div>
	{/if}
	<div class="grid grid-cols-2 w-full gap-12">
		{#each data.articles as article}
			<a href="./articles/{article.id}" class="flex flex-col gap-y-4">
				<h2 class="text-2xl">{article.title}</h2>
				<p class="text-lg">{article.summary}</p>
      </a>
		{/each}
	</div>
</main>