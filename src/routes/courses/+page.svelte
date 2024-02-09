<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { ArrowRight } from 'radix-icons-svelte';

	export let data;
</script>

<main class="w-full max-w-5xl p-4">
	<div class="w-full">
		<h2 class="mb-4 text-5xl">Explore Our Courses</h2>
	</div>
	{#await data.courses}
		Loading ... courses
	{:then courses}
		<ul class="mt-12 grid sm:grid-cols-2 gap-12">
			{#each courses as course}
				<div class="bg-card-alt p-6 border shadow-inner shadow-muted/75 rounded-xl">
					<div class="flex flex-col gap-y-1 mb-4">
						<h2 class="text-2xl sm:text-3xl">{course.label}</h2>
						<p class="text-xl text-muted-foreground">{course.description}</p>
					</div>
					<div>
						<Button disabled variant="link" class="p-0">Learn More <ArrowRight class="ml-1"/></Button>
					</div>
				</div>
			{/each}
		</ul>
	{/await}
</main>
