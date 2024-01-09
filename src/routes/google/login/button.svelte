<script lang="ts">
	import { enhance } from "$app/forms"
	import Button from "$lib/ui/Button.svelte"
	import * as Icons from "$lib/ui/icons"

	export let calendar: boolean = false
	export let label: string = "Continue with google"
</script>

<form method="post" action="/google/login" use:enhance>
	{#if calendar}
		<input type="hidden" name="calendar" value={true} />
	{/if}
	<Button
		type="submit"
		class="border-layer-6 gap-x-2 rounded-lg border shadow-sm px-3 py-2"
	>
		<Icons.Google class="size-6" />
		<span class="text-xl">{label}</span>
	</Button>
</form>
