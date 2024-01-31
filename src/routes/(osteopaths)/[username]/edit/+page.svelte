<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import OsteopathForm from "./osteopath-form.svelte";
	import type { FormSchema } from "./schema";
	import Button from "$lib/components/ui/button/button.svelte";

    export let form: SuperValidated<FormSchema>;
    export let data;
</script>

<main class="w-full max-w-5xl">
    <div class="mb-12 flex flex-col items-start justify-between sm:flex-row">
		<h2 class="text-4xl mb-4 sm:mb-0">Your Settings</h2>
		<div class="flex">
			<Button size="responsive" href="/{data.osteopath?.username}">Public View</Button>
			{#if data.user?.role === 'osteopath'}
				<div class="mr-4 border-r-2 px-2"></div>
				<Button variant="outline" size="responsive" href="/user/{data.user.id}/edit" class="w-max">Edit Profile</Button>
			{/if}
		</div>
	</div>
    <OsteopathForm about={data.osteopath?.about ?? ''} form={form} />
</main>
