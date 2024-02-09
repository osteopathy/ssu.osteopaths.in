<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import { ArrowRight, ArrowTopRight } from 'radix-icons-svelte';
	export let data;
</script>

{#if data.isLogged}
	<section class="flex flex-col place-items-center gap-y-6 p-10">
		<h1 class="text-3xl font-bold">Welcome {data.user?.name}</h1>
	</section>
{/if}
<main class="w-full max-w-5xl">
	<div class="w-full p-3">
		<h2 class="mb-12 text-5xl">Osteopaths</h2>
		{#await data.osteopaths}
			Loading osteopaths...
		{:then osteopaths}
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12">
				{#each osteopaths as osteopath}
						<Button href="/{osteopath.username}" class="group flex flex-row relative rounded-xl border bg-card hover:bg-card-alt p-4 text-card-foreground shadow h-auto w-auto whitespace-normal items-start justify-normal">
							<ArrowTopRight
								class="absolute right-4 top-4 text-card-foreground group-hover:scale-125"
							/>
							<div class="flex gap-x-4">
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
