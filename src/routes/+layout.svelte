<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
	import { ProgressBar } from 'progressbar-svelte';
	import ThemeButton from '$lib/components/theme-button.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Google from '$lib/components/ui/icons/google.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
	import type { PageData } from './$types';
	import FeedbackDialog from '$lib/components/feedback-dialog.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { CaretRight, DotsVertical, Exit, Gear, Home, Person } from 'radix-icons-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { flyAndScale } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';

	export let data: PageData;
</script>

<ProgressBar color="#5B5BD6" height="0.125em" exitDelay={500} startPosition={0} />
<Toaster />
<header class="mb-10 mt-4 flex w-full max-w-5xl items-center justify-between">
	<div class="inline-flex items-center gap-x-2 px-2 py-1">
		<Logo size={32} />
		<span class="text-xl font-medium">V2O</span>
	</div>
	<div class="flex items-center gap-x-4 rounded-full border px-2 py-2">
		<ThemeButton />
		<nav class="hidden sm:flex gap-x-3 pr-2">
			<a href="/">Home</a>
			<a href="/courses">Courses</a>
			{#if data.isLogged}
				<a href="/user/{data.user?.id}">Profile</a>
			{/if}
		</nav>
	</div>
	<div class="">
		{#if data.user}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
			  class="focus-visible sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-input bg-background text-sm font-medium text-foreground shadow-btn hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
			>
			  <DotsVertical class="h-6 w-6 text-foreground" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
			  class="w-max rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover"
			  transition={flyAndScale}
			  sideOffset={8}
			>
			  <DropdownMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				href="/"
			  >
				<div class="flex items-center">
					<Home class="mr-2 text-foreground-alt size-5" /> Home
				</div>
			  </DropdownMenu.Item>
			<DropdownMenu.Item
			class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
			href="/user/{data.user.id}"
		  >
			<div class="flex items-center">
			  <Person class="mr-2 text-foreground-alt size-5" />
			  Profile
			</div>
		  </DropdownMenu.Item>
			  <DropdownMenu.Item
				class="flex h-10 select-none items-center rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
				href="/user/{data.user.id}/edit"
			  >
				<div class="flex items-center">
				  <Gear class="mr-2 text-foreground-alt size-5" />
				  Settings
				</div>
				<!-- <div class="ml-auto flex items-center gap-px">
				  <kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-xs text-muted-foreground shadow-kbd size-5"
				  >
					⌘
				  </kbd>
				  <kbd
					class="inline-flex items-center justify-center rounded-button border border-dark-10 bg-background text-[10px] text-muted-foreground shadow-kbd size-5"
				  >
					S
				  </kbd>
				</div> -->
			  </DropdownMenu.Item>
			  <DropdownMenu.Item
				class={buttonVariants({variant:'destructive',class:'data-[highlighted]:bg-destructive/80 data-[highlighted]:text-destructive-foregound flex h-10 select-none items-center justify-start rounded-button py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent'})}
				href="/google/logout"
			  >
				<div class="flex items-center">
				  <Exit class="mr-2 text-foreground-alt size-5" />
				  Logout
				</div>
			  </DropdownMenu.Item>
			</DropdownMenu.Content>
		  </DropdownMenu.Root>
			<Button class="rounded-full hidden sm:block" href="/google/logout" variant="destructive">Logout</Button>
		{:else}
			<a href="/google/login" class="flex items-center gap-x-2 rounded-full border px-3 py-2">
				<Google class="size-5" /> Continue With Google
			</a>
		{/if}
	</div>
</header>
<slot />
<footer
	class="bg-layer-2 shadow-layer-6/30 mb-10 mt-auto flex w-full max-w-5xl flex-col rounded-xl border py-2 pl-2 pr-4 shadow-md"
>
	<div class="mb-2 flex w-full flex-col items-center justify-between gap-y-4 sm:mb-1 sm:flex-row">
		<div class="flex items-center gap-x-2">
			<Logo size={36} />
			<div class="text-layer-12 whitespace-nowrap text-2xl font-semibold">V2O</div>
		</div>
		<div
			class="xs:flex-row text-layer-11 flex flex-wrap items-center justify-center space-x-4 text-sm font-semibold leading-6"
		>
			<a href="/privacy-policy" class="hover:underline">Privacy policy</a>
			<div class="xs:block hidden h-4 w-px bg-slate-500/20"></div>
			<a href="/term-of-service" class="hover:underline">Term of Service</a>
			<div class="xs:block hidden h-4 w-px bg-slate-500/20"></div>
			<a href="/contact-us" class="hover:underline">Contact Us</a>
		</div>
	</div>
	<span class="text-layer-9 mt-1 p-px text-center text-sm font-medium sm:text-left"
		>built with sveltekit, typescript,<br class="xs:hidden block" /> tailwindcss and tursodb</span
	>
</footer>
{#if data.isLogged}
	<FeedbackDialog />
{/if}
<div
	class="font-robotic fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-950 p-3 text-xs text-white"
>
	<div class="xs:hidden block">vs</div>
	<div class="xs:block hidden sm:hidden">xs</div>
	<div class="hidden sm:block md:hidden">sm</div>
	<div class="hidden md:block lg:hidden">md</div>
	<div class="hidden lg:block xl:hidden">lg</div>
	<div class="hidden xl:block 2xl:hidden">xl</div>
	<div class="hidden 2xl:block">2xl</div>
</div>
