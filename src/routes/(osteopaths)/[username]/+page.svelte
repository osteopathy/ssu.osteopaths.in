<script lang="ts">
	import View from './slot-view.svelte';
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Pencil1 } from 'radix-icons-svelte';
	import { toast } from 'svelte-sonner';

	export let data;
	let image = data.user?.image;
	let open = false;
</script>

<main class="flex w-full max-w-5xl flex-col items-center p-4">
	<div class="flex flex-col items-center justify-between">
		<Avatar.Root class="size-48">
			<Avatar.Image src={image} alt="@" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
		<dir class="mt-12 flex p-0">
			{#if data.isCurrentUser}
				<Button
					size="responsive"
					on:click={() => {
						navigator.clipboard.writeText(`https://ssu.osteopaths.in/${$page.params.username}`);
						toast.info('URL COPIED!');
					}}>Copy URL</Button
				>
				<div class="mr-4 border-r-2 px-2"></div>
				<Button variant="outline" size="responsive" href="/{$page.params.username}/edit"
					>Edit</Button
				>
			{:else}
				<Button on:click={() => (open = !open)} size="responsive">Book Appointment</Button>
			{/if}
		</dir>
	</div>

	<ul class="mt-4 flex max-w-96 flex-col rounded-md border">
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

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-fit">
		<Dialog.Header>
			<Dialog.Title>Book Appointment</Dialog.Title>
			<Dialog.Description>You can choose a date, and select time.</Dialog.Description>
		</Dialog.Header>
		<View bydates={data.bydates} on:book={(e) => console.log(e)} />
		{#if data.isCurrentUser}
			<div class="mt-8 flex w-full items-center justify-center">
				<a
					href="/{data.osteopath?.username}/appointments"
					class="shadow-layer-5 border-layer-6 group flex w-max items-center rounded-full border py-2 pl-3 pr-4 shadow-inner transition-all hover:scale-95"
				>
					<Pencil1 size={24} class="transition-transform group-hover:scale-95" />
					<span
						class="ml-2 mr-2 inline-block scale-105 text-2xl transition-transform group-hover:scale-100"
					>
						Edit
					</span>
					<ArrowRight
						size={24}
						class="transition-transform group-hover:translate-x-0.5 group-active:translate-x-1 "
					/>
				</a>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
