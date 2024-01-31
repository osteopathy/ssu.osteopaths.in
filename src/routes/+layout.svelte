<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
	import { ProgressBar } from "progressbar-svelte";
	import ThemeButton from '$lib/components/theme-button.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Google from '$lib/components/ui/icons/google.svelte';
	import { Toaster } from "$lib/components/ui/sonner";
	import '../app.pcss';
	import type { PageData } from './$types';
	import FeedbackDialog from './feedback/feedback-dialog.svelte';

	export let data:PageData;
</script>

<ProgressBar color="#5B5BD6" height="0.125em" exitDelay={500} startPosition={0}/>
<Toaster />
<header class="mb-10 mt-4 flex w-full max-w-5xl items-center justify-between">
	<div class="inline-flex items-center gap-x-2 px-2 py-1">
		<Logo size={32} />
		<span class="text-xl font-medium">V2O</span>
	</div>
	<div class="flex items-center gap-x-4 rounded-full border px-2 py-2">
		<ThemeButton />
		<nav class="flex gap-x-3 pr-2">
			<a href="/">Home</a>
			<a href="/courses">Courses</a>
			{#if data.isLogged}
				<a href="/user/{data.user?.id}">Profile</a>
			{/if}
		</nav>
	</div>
	<div class="hidden sm:block">
		{#if data.isLogged}
			<Button class="rounded-full" href="/google/logout" variant="destructive">Logout</Button>	
		{:else}
		<a href="/google/login" class="flex gap-x-2 items-center px-3 py-2 border rounded-full">
			<Google class="size-5" /> Continue With Google
		</a>
		{/if}
	</div>
</header>
<slot />
<footer
	class="w-full border max-w-5xl mt-auto bg-layer-2 py-2 pl-2 pr-4 mb-10 flex flex-col shadow-md shadow-layer-6/30 rounded-xl"
>
	<div class="flex flex-col sm:flex-row items-center gap-y-4 mb-2 sm:mb-1 justify-between w-full">
		<div class="flex items-center gap-x-2">
			<Logo size={36} />
			<div class="whitespace-nowrap text-2xl font-semibold text-layer-12">V2O</div>
		</div>
		<div
			class="flex flex-wrap xs:flex-row items-center justify-center space-x-4 text-sm font-semibold leading-6 text-layer-11"
		>
			<a href="/privacy-policy" class="hover:underline">Privacy policy</a>
			<div class="h-4 w-px hidden xs:block bg-slate-500/20"></div>
			<a href="/term-of-service" class="hover:underline">Term of Service</a>
			<div class="h-4 w-px hidden xs:block bg-slate-500/20"></div>
			<a href="/contact-us" class="hover:underline">Contact Us</a>
		</div>
	</div>
	<span class="p-px mt-1 font-medium text-sm text-layer-9 text-center sm:text-left"
		>built with sveltekit, typescript,<br class="block xs:hidden" /> tailwindcss and tursodb</span
	>
</footer>

<FeedbackDialog />

<div
	class="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-950 p-3 font-robotic text-xs text-white"
>
	<div class="block xs:hidden">vs</div>
	<div class="hidden xs:block sm:hidden">xs</div>
	<div class="hidden sm:block md:hidden">sm</div>
	<div class="hidden md:block lg:hidden">md</div>
	<div class="hidden lg:block xl:hidden">lg</div>
	<div class="hidden xl:block 2xl:hidden">xl</div>
	<div class="hidden 2xl:block">2xl</div>
</div>