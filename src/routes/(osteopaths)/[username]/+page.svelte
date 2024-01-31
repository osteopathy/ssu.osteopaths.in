<script lang="ts">
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data;
	let image = data.user?.image;
</script>

<main class="flex w-full max-w-5xl flex-col items-center p-4">
	<div class="flex flex-col items-center justify-between">
		<Avatar.Root class="size-48">
			<Avatar.Image src={image} alt="@" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
		<dir class="mt-12 flex p-0">
			{#if data.isCurrentUser}
				<Button size="responsive" href="/{$page.params.username}/edit">Copy URL</Button>
				<div class="mr-4 border-r-2 px-2"></div>
				<Button variant="outline" size="responsive" href="/{$page.params.username}/edit"
					>Edit</Button
				>
			{/if}
		</dir>
	</div>
		<ul class="flex max-w-96 flex-col rounded-md border mt-4">
			<li class="flex border-b px-2 pb-0.5 pt-1">
				<span>Name</span>
				<div class="mr-2 border-r px-1"></div>
				<span>{data.user.name}</span>
			</li>
			<li class="flex border-b px-2 py-0.5">
				<span>Gmail Address</span>
				<div class="mr-2 border-r px-1"></div>
				<span>{data.user.gmail}</span>
			</li>
			<li class="flex border-b px-2 py-0.5">
				<span>Course</span>
				<div class="mr-2 border-r px-1"></div>
				<span>{data.osteopath?.course?.label}</span>
			</li>
			<li class="flex border-b px-2 py-0.5">
				<span>Batch</span>
				<div class="mr-2 border-r px-1"></div>
				<span>{data.osteopath?.batch}</span>
			</li>
			{#if data.osteopath?.about}
				<li class="flex px-2 pb-1 pt-0.5">
					<span>About</span>
					<div class="mr-2 border-r px-1"></div>
					<span>{data.osteopath?.about}</span>
				</li>
			{/if}
		</ul>
</main>
