<script lang="ts">
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card/card.svelte';
	import { Minus } from 'radix-icons-svelte';
	import { Temporal } from 'temporal-polyfill';

	export let data;
</script>

<main class="w-full max-w-5xl p-4">
	<div class="w-full p-3">
		<h1 class="mb-12 text-5xl">Appointments</h1>
		<div class="flex gap-x-2">
			<a href="/{data.osteopath.username}/appointments/requests" 	aria-current={$page.url.pathname.includes('/appointments/requests')} class="px-2 py-0.5 bg-transparent aria-[current='true']:bg-layer-4 hover:bg-layer-3 rounded-full" >requests</a>
			<a href="/{data.osteopath.username}/appointments/upcoming" 	aria-current={$page.url.pathname.includes('/appointments/upcoming')} class="px-2 py-0.5 bg-transparent aria-[current='true']:bg-layer-4 hover:bg-layer-3 rounded-full" >upcoming</a>
		</div>
	</div>
	<div class="flex flex-col gap-y-8">
		<slot/>
	</div>
</main>
