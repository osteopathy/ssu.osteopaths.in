<script lang="ts">
	import { page } from '$app/stores';
	export let data;
</script>

<main class="w-full max-w-5xl p-4">
	<div class="w-full rounded-xl border py-3">
		<h1 class="border-b-2 px-4 pb-3 text-xl">Requests</h1>
		{#if data.user?.role === 'osteopath'}
			<div class="flex gap-x-2 p-2">
				<a
					aria-current={$page.url.pathname.includes('/incoming') ? 'page' : undefined}
					class="text-layer-12 border-layer-6 aria-[current='page']:border-background rounded-full border px-3 py-1 aria-[current='page']:bg-blue-500 aria-[current='page']:text-white"
					href="./incoming"
				>
					Incoming
				</a>
				<a
					aria-current={$page.url.pathname.includes('/outgoing') ? 'page' : undefined}
					class="text-layer-12 border-layer-6 aria-[current='page']:border-background rounded-full border px-3 py-1 aria-[current='page']:bg-blue-500 aria-[current='page']:text-white"
					href="./outgoing"
				>
					Outgoing
				</a>
			</div>
		{/if}
		<div class="flex flex-col gap-y-8">
			<slot />
		</div>
	</div>
</main>
