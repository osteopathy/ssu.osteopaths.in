<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { PlusCircled, Reader } from 'radix-icons-svelte';
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import { ArrowRight } from 'lucide-svelte';

	export let data: PageServerData;
</script>

<main class="w-full max-w-5xl p-4">
	{#if !data?.articles[0]}
		<div class="mt-12 flex flex-col items-center">
			<Reader size={64} />
			<h3 class="text-layer-11 mt-2 font-semibold">No Articles</h3>
			{#if data.isCurrentUser}
				<p class="text-layer-10 mt-1 text-sm">Get started by creating a new article.</p>
				<div class="mt-6">
					<form method="post" use:enhance>
						<input type="hidden" name="osteopath-id" value={data.osteopath.id} />
						<Button type="submit" class="gap-x-1 pl-3" title="Create a Article">
							<PlusCircled size={20} /> New Article
						</Button>
					</form>
				</div>
			{/if}
		</div>
	{:else}
		<div class="mb-12">
			<div class="flex justify-between">
				<h2 class="mb-6 text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
					{#if data.isCurrentUser}
						Your
					{/if} Articles
				</h2>
				{#if data.isCurrentUser}
					<form method="post" use:enhance>
						<input type="hidden" name="osteopath-id" value={data.osteopath.id} />
						<Button type="submit" class="gap-x-1 pl-3" title="Create a Article">
							<PlusCircled size={20} /> New Article
						</Button>
					</form>
				{/if}
			</div>
			<p class="text-xl sm:text-2xl md:text-3xl lg:text-4xl">Learn more about Osteopathy</p>
		</div>
	{/if}
	<div class="grid w-full grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
		{#each data.articles as article}
			<div class="bg-card-alt rounded-xl border p-6 shadow-inner shadow-muted/75">
				<div class="mb-4 flex flex-col gap-y-1">
					<h2 class="text-2xl sm:text-3xl">{article.title}</h2>
					<p class="text-xl text-muted-foreground">
						{article.summary}
					</p>
				</div>
				<div>
					<Button href="/{data.osteopath.username}/articles/{article.id}/" variant="link" class="p-0">
						Read More <ArrowRight class="ml-1" />
					</Button>
				</div>
			</div>
		{/each}
	</div>
</main>
