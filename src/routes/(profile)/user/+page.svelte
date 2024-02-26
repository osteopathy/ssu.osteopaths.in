<script lang="ts">
	import type { PageServerData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar';

	export let data: PageServerData;
</script>

<main class="w-full max-w-5xl p-4">
	<div class="flex flex-wrap items-center justify-center gap-4">
		{#each data.users as user}
			<div
				class="relative flex gap-x-3 rounded-full bg-opacity-10 py-2 pl-2 pr-8"
				class:bg-blue-500={user.role === 'osteopath'}
				class:bg-teal-500={user.role === 'student'}
				class:bg-pink-500={user.role === 'user'}
			>
				<Avatar.Root class="size-16">
					<Avatar.Image src={user.image} alt="@" />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
				<div class="flex flex-col">
					<h4>{user.name}</h4>
					<span class="w-20 truncate">{user.gmail}</span>
				</div>
				<a href={`/user/${user.id}`} class="absolute inset-0"> </a>
			</div>
		{/each}
	</div>
</main>
