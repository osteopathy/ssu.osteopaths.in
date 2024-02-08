<script lang="ts">
	import { page } from '$app/stores';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import CalendarAdd from '$lib/components/ui/icons/calendar-add.svelte';
	import { fade } from 'svelte/transition';
	import { flyAndScale } from '$lib/utils/index.js';
	import { bookAppointment } from '../../(api)/book';
	import { updateAppointment } from '../../(api)/appointment';

	export let data;
	let image = data.osteopath.user?.image;
	let open = false;
	let alertDialogOpen = false;
</script>

<main class="flex w-full max-w-5xl flex-col items-center p-4">
	<div class="flex w-max flex-col">
		
			<Avatar.Root class="size-48">
				<Avatar.Image src={image} alt="@" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
		<div class="flex w-80 flex-col mt-6">
			<h2 class="mb-1">{data.osteopath.user.name}</h2>
			<span class="mb-2 text-muted-foreground">{data.osteopath?.course?.label}</span>
			{#if data.osteopath?.about}
				<p>{data.osteopath?.about}</p>
			{/if}
		</div>
		<div class="flex w-full mt-6">
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
		</div>
	</div>
</main>

{#if data.isCurrentUser}
	<button
		on:click={() => (open = true)}
		class="fixed bottom-8 right-8 rounded-full border bg-background p-4"
	>
		<CalendarAdd size={32} />
	</button>
{/if}

{#await import('$lib/components/dialogs/schedule/book-schedule.svelte') then { default: BookSchedule }}
	<BookSchedule
		on:book={async (e) => {
			if (!!!data?.user || !!!data?.osteopath || !!!data.osteopath?.id) {
				open = false;
				alertDialogOpen = true;
				return;
			}
			await updateAppointment(e.detail.id, {
				osteopathId: data.osteopath.id,
				date: e.detail.date,
				startTime: e.detail.startTime,
				duration: e.detail.duration
			});
			toast.loading('Booking Appointment...');
			try {
				await bookAppointment(
					data.osteopath.calendarId,
					data.user.id,
					{
						gmail: data.osteopath.user.gmail,
						id: data.osteopath.id
					},
					e.detail
				);
				toast.success(`Appointment Booked!`);
				open = false;
			} catch (error) {
				toast.error('Failed to book appointment!');
				console.log(error);
			}
		}}
		editable={data.isCurrentUser}
		bind:open
		bydates={data.bydates}
	/>
{/await}

<AlertDialog.Root bind:open={alertDialogOpen}>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			transition={fade}
			transitionConfig={{ duration: 150 }}
			class="fixed inset-0 z-10 bg-black/80"
		/>
		<AlertDialog.Content
			transition={flyAndScale}
			class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-7 shadow-sm outline-none sm:max-w-lg md:w-full"
		>
			<div class="flex flex-col gap-4 pb-4">
				<AlertDialog.Title class="text-lg font-semibold tracking-tight"
					>You need to Login</AlertDialog.Title
				>
				<AlertDialog.Description class="text-foreground-alt text-sm">
					To book an appointment, you need to login with your Google Account first.
				</AlertDialog.Description>
			</div>
			<div class="flex w-full items-center justify-center gap-2">
				<AlertDialog.Cancel
					class="active:scale-98 inline-flex w-full items-center justify-center rounded-lg bg-muted text-[15px] font-medium shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					Cancel
				</AlertDialog.Cancel>
				<Button
					href="/google/login"
					class="focus-visible:ring-dark active:scale-98 inline-flex w-full items-center justify-center rounded-lg text-[15px] font-semibold text-background shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					Continue with Google
				</Button>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
