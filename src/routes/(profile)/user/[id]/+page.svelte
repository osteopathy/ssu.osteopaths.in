<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data;
	let image = data.user?.image;
</script>

<main class="flex w-full max-w-5xl flex-col p-4">
	<div class="flex items-start justify-between">
		<h2 class="mb-8 text-4xl">Profile</h2>
		{#if data.isCurrentUser}
			<Button href="/user/{data.user?.id}/edit">Edit</Button>
		{/if}
	</div>
	<!-- <pre>{JSON.stringify(data.user)}</pre> -->
	<div class="flex flex-col items-center gap-8 sm:flex-row">
		<Avatar.Root class="size-20">
			<Avatar.Image src={image} alt="@" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
	</div>

	<div class="mt-4 flex">
		<p>{data.user?.name}</p>
	</div>
</main>
