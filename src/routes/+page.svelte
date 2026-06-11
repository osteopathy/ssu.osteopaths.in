<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import GoogleIcon from "$lib/icons/GoogleIcon.svelte";
	import AppShell from "./AppShell.svelte";
</script>

<AppShell class="flex items-center justify-center">
	{#snippet header()}
		&nbsp;
	{/snippet}
    <div class="flex flex-col items-center">
    	<h1 class="text-xl mb-4"> we to all (V2O) </h1>
	   	<Button href="/login/google" variant="default" size="lg">
	    	<GoogleIcon /> Continue With Google
		</Button>
    </div>
</AppShell>
