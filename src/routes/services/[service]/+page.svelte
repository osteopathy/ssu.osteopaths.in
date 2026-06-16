<script lang="ts">
	import { page } from "$app/state";
	import Avatar from "$lib/components/ui/avatar/avatar.svelte";
	import ArrowRightIcon from "$lib/icons/ArrowRightIcon.svelte";
	import { route } from "$lib/routes_helper";
	import AppShell from "../AppShell.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<AppShell back="/{data.user?.id}/service" heading="Osteopaths" class="mt-4">
	<div class="flex w-full flex-col items-start gap-3 px-2.5 sm:gap-6">
		{#each data.serviceProviderList as serviceProvider, index (index)}
			<a
				href={route("/services/[service]/[service_provider_id]", {
					service: page.params.service,
					service_provider_id: serviceProvider.id
				})}
				class="bg-muted group hover:bg-layer-4 flex w-full items-start justify-between gap-x-3 rounded-lg p-3"
			>
				<Avatar
					class="size-14"
					src={serviceProvider.user.picture}
					alt="@{serviceProvider.username}"
					fallback={(serviceProvider.user.name ?? " . ").substring(0, 2)}
				/>
				<div class="flex w-full flex-col overflow-auto">
					<h3 class="text-foreground w-full text-xl font-medium">{serviceProvider.user.name}</h3>
					<p class="text-muted-foreground w-0 min-w-0 text-lg font-medium">
						{serviceProvider.user.universityMail}
					</p>
				</div>
				<ArrowRightIcon class="size-7" />
			</a>
		{/each}
	</div>
</AppShell>
