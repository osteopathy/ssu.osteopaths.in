<script lang="ts">
	import { ArrowRightIcon } from '$lib/ui/icons';
	const roles = [
		{
			label: 'Junior Front-end Developer'
		},
		{
			label: 'UI/UX Engineer'
		}
	];
</script>

<main class="max-w-5xl w-full">
	<h1 class="mb-4">
		<span
			class="bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-300 text-transparent bg-clip-text text-8xl font-extrabold"
		>
			Join us
		</span>
	</h1>
	<h2 class="text-4xl text-layer-10 font-bold p-1">Built what matters in reality</h2>
	<p class="mt-4 p-1.5 font-medium text-lg text-layer-11 max-w-3xl">
		We are a team of young enthuiastis who are always ready to get themsvelves a experience of
		learning by building real world products.
	</p>
	<div class="flex flex-col mt-6 p-6 border rounded-lg">
		<h2 class="text-2xl font-semibold text-layer-12">Job Opening</h2>
		<ul class="flex flex-col gap-y-2 mt-6 theme-blue">
			{#each roles as role}
				<li class="">
					<span
						class="text-lg text-layer-11 hover:underline hover:text-layer-10 inline-flex items-center gap-x-4"
					>
						<ArrowRightIcon />{role.label}</span
					>
				</li>
			{/each}
		</ul>
	</div>
</main>
