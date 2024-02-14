<script context="module">
	export const modules = [
		{
			label: 'Courses',
			href: '/admin/courses'
		},
		{
			label: 'Users',
			href: '/admin/users'
		},
		{
			label: 'Osteopaths',
			href: '/admin/osteopaths'
		},
		{
			label: 'Feedback',
			href: '/admin/feedback'
		}
	];
</script>

<script lang="ts">
	import { page } from '$app/stores';
</script>

<section class="flex w-full max-w-5xl gap-x-4 p-10">
	<aside class="flex flex-col rounded-md border p-6">
		<h2 class="">Modules</h2>
		<ul class="mt-4 flex flex-col gap-y-3">
			{#each modules as mod}
				<li class="">
					<a
						aria-current={$page.url.pathname === mod.href ? 'page' : undefined}
						class="rounded-md bg-secondary px-3 py-1 aria-[current='page']:bg-accent aria-[current='page']:text-accent-foreground"
						href={mod.href}
					>
						{mod.label}
					</a>
				</li>
			{/each}
		</ul>
	</aside>
	<main class="w-full grow rounded-md border p-6">
		<slot />
	</main>
</section>
