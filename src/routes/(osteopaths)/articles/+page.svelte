<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight } from 'radix-icons-svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<main class="w-full max-w-5xl p-4">
	<div class="w-full">
		<h2 class="mb-4 text-5xl">Articles</h2>
	</div>
	<div class="mt-12 grid gap-12 sm:grid-cols-2">
		{#each data.articles as article}
			<div class="bg-card-alt rounded-xl border p-6 shadow-inner shadow-muted/75">
				<div class="mb-4 flex flex-col gap-y-1">
					<h2 class="text-2xl sm:text-3xl">{article.title}</h2>
					<p class="text-xl text-muted-foreground">
						{article.summary}
					</p>
				</div>
				<div>
					<Button href="/articles/{article.id}" variant="link" class="p-0">
						Read More <ArrowRight class="ml-1" />
					</Button>
				</div>
			</div>
		{/each}
	</div>
</main>
