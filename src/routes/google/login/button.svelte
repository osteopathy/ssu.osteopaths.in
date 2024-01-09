<script lang="ts">
	import { enhance } from "$app/forms"
	export let calendar: boolean = false
	export let label: string
</script>

<form method="post" action="/google/login" use:enhance>
	{#if calendar}
		<input type="hidden" name="calendar" value={true} />
	{/if}
	<button>{label}</button>
</form>
