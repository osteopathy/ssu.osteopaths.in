<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
	import { ProgressBar } from 'progressbar-svelte';
	import ThemeButton from '$lib/components/theme-button.svelte';
	import Google from '$lib/components/ui/icons/google.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import '../app.pcss';
	import type { LayoutData } from './$types';
	import FeedbackDialog from '$lib/components/dialogs/feedback-dialog.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { ChatBubble, Exit, Gear, Person, Reader } from 'radix-icons-svelte';
	import { flyAndScale } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { pwaAssetsHead } from 'virtual:pwa-assets/head';
	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r) {
					// uncomment following code if you want check for updates
					// r && setInterval(() => {
					//    console.log('Checking for sw update')
					//    r.update()
					// }, 20000 /* 20s for testing purposes */)
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				}
			});
		}
	});

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	let feedbackDialogOpen = false;
	export let data: LayoutData;
</script>

<svelte:head>
	{#if pwaAssetsHead.themeColor}
		<meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
	{/if}
	{#each pwaAssetsHead.links as link}
		<link {...link} />
	{/each}
	{@html webManifestLink}
</svelte:head>

<ProgressBar color="#5B5BD6" height="0.250em" exitDelay={250} startPosition={0} />
<Toaster />
<ModeWatcher />

<header class="mb-6 mt-4 flex w-full max-w-5xl items-center justify-between">
	<div class="flex w-full items-center gap-x-4 pl-1 sm:pl-4">
		<nav class="flex sm:gap-x-3">
			<a
				aria-current={$page.url.pathname === '/' ? 'page' : undefined}
				class="rounded-full px-2 py-0.5 text-layer-11 transition-colors hover:bg-layer-4 aria-[current]:bg-layer-4 aria-[current]:text-layer-12"
				href="/"
			>
				Osteopaths
			</a>
			<a
				aria-current={$page.url.pathname === '/articles' ? 'page' : undefined}
				class="hidden rounded-full px-2 py-0.5 text-layer-11 transition-colors hover:bg-layer-4 aria-[current]:bg-layer-4 aria-[current]:text-layer-12 sm:block"
				href="/articles"
			>
				Articles
			</a>
			{#if data.isLogged}
				<a
					aria-current={$page.url.pathname.includes('/requests') ? 'page' : undefined}
					class="rounded-full px-2 py-0.5 text-layer-11 transition-colors hover:bg-layer-4 aria-[current]:bg-layer-4 aria-[current]:text-layer-12"
					href="/user/{data.user?.id}/{data.user?.role === 'osteopath'
						? 'redirect?to=requests'
						: 'requests'}"
				>
					Requests
				</a>
			{/if}
		</nav>
		<ThemeButton />
	</div>
	<div class="flex items-center">
		{#if data.user}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class="inline-flex size-10 items-center justify-center rounded-full border bg-background text-sm font-medium text-foreground hover:border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					<Avatar.Root class="size-9">
						<Avatar.Image src={data.user?.image} alt="@{data.user.name} Profile Pic" />
						<Avatar.Fallback>{data.user?.name?.at(0)}</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="w-max rounded-xl border border-muted bg-popover px-1 py-1.5 text-popover-foreground shadow-popover"
					transition={flyAndScale}
					sideOffset={8}
					side="bottom"
					align="end"
				>
					<DropdownMenu.Group>
						<DropdownMenu.Item
							class="flex h-10 select-none items-center rounded-md py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
							href="/user/{data.user.id}/{data.user.role === 'osteopath' ? 'redirect' : ''}"
						>
							<div class="flex items-center">
								<Person class="mr-2 size-5 text-foreground-alt" />
								Profile
							</div>
						</DropdownMenu.Item>
						<DropdownMenu.Item
							class="flex h-10 select-none items-center rounded-md py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
							href={data.user?.role === 'osteopath'
								? `/user/${data.user?.id}/redirect?to=articles`
								: '/articles'}
						>
							<div class="flex items-center">
								<Reader class="mr-2 size-5 text-foreground-alt" />
								Articles
							</div>
						</DropdownMenu.Item>
						<DropdownMenu.Item
							class="flex h-10 select-none items-center rounded-md py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
							href="/user/{data.user.id}/edit"
						>
							<div class="flex items-center">
								<Gear class="mr-2 size-5 text-foreground-alt" />
								Settings
							</div>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Item
						class="flex h-10 select-none items-center rounded-md py-1 pl-3 pr-4 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						on:click={() => (feedbackDialogOpen = true)}
					>
						<div class="flex items-center">
							<ChatBubble class="mr-2 size-5 text-foreground-alt" />
							Give Feedback
						</div>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item
						class={buttonVariants({
							variant: 'destructive',
							class:
								'data-[highlighted]:text-destructive-foregound flex h-10 select-none items-center justify-start rounded-md py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-destructive/80'
						})}
						href="/google/logout"
					>
						<div class="flex items-center">
							<Exit class="mr-2 size-5 text-foreground-alt" />
							Logout
						</div>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else}
			<a href="/google/login" class="m-2 flex items-center gap-x-2 rounded-full border px-3 py-2">
				<Google class="size-5" /> <span class="whitespace-nowrap">Login With Google</span>
			</a>
		{/if}
	</div>
</header>

<slot />

<div class="py-6"></div>
<footer
	class="mb-10 mt-auto flex w-full max-w-5xl flex-col rounded-xl border bg-layer-2 py-2 pl-2 pr-4 shadow-md shadow-layer-6/30"
>
	<div class="mb-2 flex w-full flex-col items-center justify-between gap-y-4 sm:mb-1 sm:flex-row">
		<div class="flex items-center gap-x-2">
			<Logo size={36} />
			<div class="whitespace-nowrap text-2xl font-semibold text-layer-12">V2O</div>
		</div>
		<div
			class="xs:flex-row flex flex-wrap items-center justify-center space-x-4 text-sm font-semibold leading-6 text-layer-11"
		>
			<a href="https://osteopaths.in/privacy-policy" class="hover:underline">Privacy policy</a>
			<div class="xs:block hidden h-4 w-px bg-slate-500/20"></div>
			<a href="https://osteopaths.in/term-of-service" class="hover:underline">Term of Service</a>
			<div class="xs:block hidden h-4 w-px bg-slate-500/20"></div>
			<a href="https://osteopaths.in/contact-us" class="hover:underline">Contact Us</a>
		</div>
	</div>
	<span class="mt-1 p-px text-center text-sm font-medium text-layer-9 sm:text-left">
		built with sveltekit, typescript,<br class="xs:hidden block" /> tailwindcss and tursodb
	</span>
</footer>

{#await import('$lib/components/ReloadPrompt.svelte') then { default: ReloadPrompt }}
	<ReloadPrompt />
{/await}

{#if data.isLogged}
	<FeedbackDialog buttonVisible={false} bind:open={feedbackDialogOpen} />
{/if}
<!-- <div class="inline-flex items-center gap-x-2 px-2 py-1">
	{#if $page.url.pathname === '/'}
		{#if data.user}
			<a
				href="/user/{data.user?.id}"
				class="flex w-max items-center gap-x-2"
			>
				<Avatar.Root class="size-8">
					<Avatar.Image src={data.user?.image} alt="@{data.user.name} Profile Pic" />
					<Avatar.Fallback>{data.user?.name?.at(0)}</Avatar.Fallback>
				</Avatar.Root>
				<h3 class="text-lg max-w-40 whitespace-nowrap overflow-auto">{data.user?.name}</h3>
			</a>
		{:else}
			<Logo size={32} />
			<span class="text-xl font-medium">V2O</span>
		{/if}
	{:else}
		<Button
			class="gap-x-2 p-1 md:p-0"
			variant="link"
			on:click={() => (previousPage ? goto(previousPage) : goto('/'))}
		>
			<ArrowLeft />
			Back
		</Button>
	{/if}
</div>
<div class="flex items-center gap-x-4 rounded-full border px-2 py-2">
	<ThemeButton />
	<nav class="hidden gap-x-3 pr-2 sm:flex">
		<a href="/">Home</a>
		<a href="/courses">Courses</a>
		<a href="/articles">Articles</a>
		{#if data.isLogged}
			<a href="/user/{data.user?.id}">Profile</a>
		{/if}
	</nav>
</div>
<div>
	{#if data.user}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class="focus-visible border-border-input shadow-btn active:scale-98 m-2 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background text-sm font-medium text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:hidden"
			>
				<DotsVertical class="h-6 w-6 text-foreground" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-max rounded-xl border border-muted bg-popover px-1 py-1.5 text-popover-foreground shadow-popover"
				transition={flyAndScale}
				sideOffset={8}
			>
				<DropdownMenu.Group>
					<DropdownMenu.Item
						class="flex h-10 select-none items-center rounded-md py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						href="/"
					>
						<div class="flex items-center">
							<Home class="text-foreground-alt mr-2 size-5" /> Home
						</div>
					</DropdownMenu.Item>
					<DropdownMenu.Item
						class="flex h-10 select-none items-center rounded-md py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						href="/user/{data.user.id}"
					>
						<div class="flex items-center">
							<Person class="text-foreground-alt mr-2 size-5" />
							Profile
						</div>
					</DropdownMenu.Item>
					<DropdownMenu.Item
						class="flex h-10 select-none items-center rounded-md py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
						href="/user/{data.user.id}/edit"
					>
						<div class="flex items-center">
							<Gear class="text-foreground-alt mr-2 size-5" />
							Settings
						</div>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					class="flex h-10 select-none items-center rounded-md py-1 pl-3 pr-4 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-muted"
					on:click={() => (feedbackDialogOpen = true)}
				>
					<div class="flex items-center">
						<ChatBubble class="text-foreground-alt mr-2 size-5" />
						Give Feedback
					</div>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					class={buttonVariants({
						variant: 'destructive',
						class:
							'data-[highlighted]:text-destructive-foregound flex h-10 select-none items-center justify-start rounded-md py-3 pl-3 pr-1.5 text-sm font-medium !ring-0 !ring-transparent data-[highlighted]:bg-destructive/80'
					})}
					href="/google/logout"
				>
					<div class="flex items-center">
						<Exit class="text-foreground-alt mr-2 size-5" />
						Logout
					</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<Button class="hidden rounded-full sm:block" href="/google/logout" variant="destructive">
			Logout
		</Button>
	{:else}
		<a href="/google/login" class="m-2 flex items-center gap-x-2 rounded-full border px-3 py-2">
			<Google class="size-5" /> <span class="block sm:hidden">Signup</span>
			<span class="hidden sm:block">Continue With Google </span>
		</a>
	{/if}
</div> -->
