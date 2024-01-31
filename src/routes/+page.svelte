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
	<div class="w-full">
		<h2 class="mb-4 text-5xl">Osteopaths</h2>
		{#await data.osteopaths}
			Loading osteopaths...
		{:then osteopaths}
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
			{#each osteopaths as osteopath}
				<div class="group rounded-xl relative border p-4 bg-card text-card-foreground shadow">
					<ArrowTopRight class="absolute top-4 right-4 text-card-foreground group-hover:scale-125"/>
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
								<p class="text-sm mt-1 text-foreground/90 line-clamp-2">{osteopath.about}</p>
							{/if}
							<a href="/{osteopath.username}" class="flex items-center gap-x-0.5 text-blue-600 dark:text-sky-500">
								<span class="inline-block text-sm/6 hover:underline"> view-profile </span>
								<ArrowRight/> 
							</a>
						</div>
					</div>
				</div>
			{/each}
			</div>
		{:catch error}
			<p>error loading osteopaths: {error.message}</p>
		{/await}
	</div>
</main>
