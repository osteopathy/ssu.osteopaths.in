<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { ArrowTopRight } from 'radix-icons-svelte';
	export let data;
</script>

<svelte:head>
	<title>V2O Osteopathy App</title>
	<meta name="description" content="A Online Platform for making it easy for people to find and book osteopathy appointments online." />
</svelte:head>

<main class="w-full max-w-5xl">
	<div class="w-full p-3">
		<h2 class="mb-12 text-5xl">Osteopaths</h2>
		{#await data.osteopaths}
			Loading osteopaths...
		{:then osteopaths}
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-6 md:grid-cols-4 sm:gap-8 md:gap-12">
				{#each osteopaths as osteopath}
					<Button
						href="/{osteopath.username}"
						class="group relative flex h-auto w-auto flex-row items-start justify-normal whitespace-normal rounded-xl border bg-card p-4 text-card-foreground shadow hover:bg-card-alt"
					>
						<ArrowTopRight
							class="absolute right-4 top-4 text-card-foreground group-hover:scale-125"
						/>
						<div class="flex gap-y-4 flex-col">
							<Avatar.Root class="size-20">
								<Avatar.Image src={osteopath.user.image} alt="@" />
								<Avatar.Fallback>CN</Avatar.Fallback>
							</Avatar.Root>
							<div>
								<div class="mb-1 flex gap-x-2">
									<span class="inline-block rounded bg-muted px-1 text-sm text-muted-foreground">
										{osteopath.username}
									</span>
									<span class="inline-block rounded bg-muted px-1 text-sm text-muted-foreground">
										{osteopath.batch}
									</span>
								</div>
								<Card.Title>{osteopath.user.name}</Card.Title>
								<Card.Description>{osteopath.course.label}</Card.Description>
								{#if osteopath.about}
									<p class="mt-1 line-clamp-2 text-sm text-foreground/90">{osteopath.about}</p>
								{/if}
							</div>
						</div>
					</Button>
				{/each}
			</div>
		{:catch error}
			<p>error loading osteopaths: {error.message}</p>
		{/await}
	</div>
</main>
