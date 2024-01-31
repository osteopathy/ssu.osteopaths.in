<script lang="ts">
	export let data;
</script>

<main class="w-full max-w-5xl p-4">
	<div class="w-full">
		<h2 class="mb-4 text-5xl">Courses</h2>
		<p>Sri Sri University offers following courses in field of osteopathy</p>
	</div>
	{#await data.courses}
		Loading ... courses
	{:then courses}
		<ul class="mt-12 flex flex-wrap gap-12">
			{#each courses as course}
				<div class="rounded-md border bg-card p-4 text-card-foreground shadow">
					<h2 class="text-xl">{course.label}</h2>
					<p>{course.description}</p>
				</div>
			{/each}
		</ul>
	{/await}
</main>
