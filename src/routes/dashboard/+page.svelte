<script lang="ts">
	import { Dialog, Separator } from 'bits-ui';
	import DatePicker from './DatePicker.svelte';
	import Avatar from '$lib/ui/Avatar.svelte';
	import LogoutButton from '../google/logout/button.svelte';
	import { ArrowRightIcon, CheckCheckIcon } from 'lucide-svelte';
	import { cn, flyAndScale } from '$lib';
	import { Temporal } from '@js-temporal/polyfill';
	import AvailabilityPanel from './AvailabilityPanel.svelte';

	let { data } = $props();

	const startAt = new Temporal.PlainTime(9);

	import { fade } from 'svelte/transition';

	let menu = {
		morning: {
			startAt,
			endAt: startAt.add({
				hours: 2
			})
		},
		afternoon: {
			startAt: startAt.add({
				hours: 2
			}),
			endAt: startAt.add({
				hours: 5
			})
		},
		evening: {
			startAt: startAt.add({
				hours: 5
			}),
			endAt: startAt.add({
				hours: 9
			})
		}
	} as const;

	let selected = $state<Record<string, boolean>>({});
	let dialogOpen = $state(false);
</script>

<section class="p-4 flex gap-8 w-full justify-between min-h-screen max-w-6xl">
	<aside class="flex flex-col justify-between shrink-0">
		<ul class="flex flex-col gap-y-4">
			<li>
				<DatePicker size="sm" />
			</li>
			<li class="flex flex-col items-start gap-y-2 mt-3">
				{#each Object.keys(menu) as label, i (label)}
					<button
						class={cn(
							'flex items-center border border-layer-7 rounded-lg px-1.5 py-1 w-full justify-between gap-x-3 text-sm',
							selected[label] ? 'text-layer-13' : 'text-layer-8'
						)}
						on:click={() => {
							selected[label] = !selected[label];
						}}
					>
						<div class="flex gap-x-2">
							<CheckCheckIcon
								size={20}
								class={cn(selected[label] ? 'text-blue-600' : 'text-layer-8')}
							/>
							<span>{label}</span>
						</div>
						<div class="flex gap-x-2">
							<span
								>{menu[label as keyof typeof menu].startAt.toLocaleString("en", {
									hour: "numeric",
								})}</span
							>
							<span>to</span>
							<span
								>{menu[label as keyof typeof menu].endAt.toLocaleString("en", {
									hour: "numeric",
								})}</span
							>
						</div>
					</button>
				{/each}
			</li>
		</ul>
		<div class="flex flex-col gap-y-4">
			<button
				onclick={() => (dialogOpen = !dialogOpen)}
				class="flex items-center font-medium text-left px-3 py-2 rounded-full shadow-inner shadow-layer-5 border border-layer-6 gap-x-2"
			>
				<Avatar
					src={data.user.image}
					alt="@{data.user.name}"
					placeholder={data.user.name[0] + data.user.name[1]}
				/>
				<div class="flex flex-col grow w-0">
					<h3 class="text-lg/6 w-full">{data.user.name}</h3>
					<div class="-mt-1 text-sm flex items-center">
						<span class=""> view profile </span>
						<span> <ArrowRightIcon size={16} /> </span>
					</div>
				</div>
			</button>
			{#if data.user.role === 'osteopath'}
				<Dialog.Root>
					<Dialog.Trigger
						class="inline-flex h-12 items-center
  justify-center whitespace-nowrap rounded-input bg-dark px-[21px]
  text-[15px] font-semibold text-background shadow-mini transition-colors hover:bg-dark/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
						asChild
						let:builder
					>
						<button
							use:builder.action
							{...builder}
							class="flex items-center theme-indigo bg-layer-1 font-medium text-left px-3 py-2 rounded-full shadow-inner shadow-layer-5 border border-layer-6 gap-x-2"
						>
							<div class="size-10 flex bg-layer-3 rounded-full items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
									/>
								</svg>
							</div>
							<div class="flex flex-col grow w-0">
								<h3 class="text-base/6 w-full">Weekly Availability</h3>
								<div class="-mt-1 text-sm flex items-center">
									<span class=""> change </span>
									<span> <ArrowRightIcon size={16} /> </span>
								</div>
							</div>
						</button>
					</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Overlay
							transition={fade}
							transitionConfig={{ duration: 150 }}
							class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
						/>
						<Dialog.Content
							transition={flyAndScale}
							class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] sm:max-w-[978px] bg-layer-0 rounded-lg translate-x-[-50%] translate-y-[-50%] border p-5 outline-none md:w-full"
						>
							<AvailabilityPanel availabilities={data?.availabilities && data.availabilities} />
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			{/if}
			<LogoutButton class="w-max pr-3" label="Logout" />
		</div>
	</aside>
	<main class="flex flex-col gap-4 flex-1">
		{#await data.osteopaths.data}
			<h2>Loading List of Osteopaths</h2>
		{:then osteopaths}
			<h2>List of Osteopaths</h2>
			<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{#each osteopaths as osteopath}
					<li class="col-span-1 flex flex-col p-2 shadow shadow-layer-6 rounded-lg">
						<div class="flex gap-x-2 h-full">
							<Avatar
								size="md"
								src={osteopath.user.image}
								alt="@{osteopath.user.name}"
								placeholder={osteopath.user.name[0] + osteopath.user.name[1]}
							/>
							<div class="flex flex-col justify-between h-full">
								<h3 class="font-medium text-sm line-clamp-2">{osteopath.user.name}</h3>
								<div class="mt-2">
									<button
										class="text-sm bg-layer-3 text-layer-12 px-2 py-1 inline-flex items-center rounded-md"
										>Book
									</button>
								</div>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		{/await}
	</main>
	<!-- <div class="shrink w-64">Div</div> -->
</section>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Portal>
		<Dialog.Overlay
			transition={fade}
			transitionConfig={{ duration: 150 }}
			class="fixed inset-0 z-50 bg-layer-0/80 backdrop-blur-sm"
		/>
		<Dialog.Content
			transition={flyAndScale}
			class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-md border bg-background p-5 outline-none sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title class="">Profile Settings</Dialog.Title>
			<Separator.Root class="-mx-5 mb-6 mt-5 block h-px bg-layer-4" />
			<div class="flex flex-col gap-x-6 gap-y-6">
				<div class="">
					<label for="full-name" class="block text-sm font-medium leading-6 text-layer-12">
						Full Name
					</label>
					<div class="mt-2">
						<input
							type="text"
							name="full-name"
							id="full-name"
							autocomplete="family-name"
							class="block w-full rounded-md border-0 bg-layer-2 hover:bg-layer-3/50 focus:bg-layer-2 py-1.5 text-layer-12 shadow-sm ring-1 ring-inset ring-layer-9 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							value={data.user?.name ?? ''}
						/>
					</div>
				</div>
			</div>
			<div class="flex w-full justify-end">
				<Dialog.Close
					class="inline-flex h-input items-center justify-center rounded-input bg-dark px-[50px] text-[15px] font-semibold text-background shadow-mini hover:bg-dark/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
				>
					Save
				</Dialog.Close>
			</div>
			<Dialog.Close
				class="absolute right-5 top-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
			>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>

					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
