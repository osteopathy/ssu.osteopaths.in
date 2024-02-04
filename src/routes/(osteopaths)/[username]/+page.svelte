<script lang="ts">
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Pencil1 } from 'radix-icons-svelte';
	import { toast } from 'svelte-sonner';
	import BookSchedule from '$lib/components/dialogs/schedule/book-schedule.svelte';
	import CalendarAdd from '$lib/components/ui/icons/calendar-add.svelte';

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

{#if data.user?.role === 'osteopath'}
	<button on:click={() => open = true} class="p-4 rounded-full bg-background border fixed bottom-8 right-8" >
		<CalendarAdd size={32} />
	</button>
	<BookSchedule editable bind:open bydates={data.bydates} />
	{:else}
	<BookSchedule editable={false} bind:open bydates={data.bydates} />
{/if}