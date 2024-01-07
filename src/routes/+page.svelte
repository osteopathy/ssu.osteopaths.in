<script lang="ts">
	import Button from '$lib/ui/Button.svelte';
	import * as Icons from '$lib/ui/icons';

	export let data;
</script>

<main class="flex grow items-center justify-center">
	<Button onclick={() => console.log('HELLO WORLD')} class="border-layer-6 gap-x-2 rounded-lg border shadow-sm">
		<Icons.Google class="size-6" />
		<span class="text-xl">Continue with google</span>
	</Button>
</main>
