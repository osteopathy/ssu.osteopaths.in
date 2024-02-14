<script lang="ts">
	import type { CreateOsteopathSchema } from '$lib/db/schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import OsteopathForm from './osteopath-form.svelte';
	import DataTable from './data-table.svelte';
	export let form: SuperValidated<CreateOsteopathSchema>;
	export let data;

	let dialogEl: HTMLDialogElement;
</script>

<div class="mb-8 sm:flex sm:items-center">
	<div class="sm:flex-auto">
		<h1 class="text-base font-semibold leading-6">Osteopath</h1>
		<p class="mt-2 text-sm text-muted-foreground">
			A list of all the osteopath's registed in Sri Sri University
		</p>
	</div>
	<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
		<button
			on:click={() => dialogEl.showModal()}
			type="button"
			class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			Add Osteopath
		</button>
	</div>
</div>

<DataTable data={data.osteopaths} {form} />

<dialog
	bind:this={dialogEl}
	class="w-full max-w-xs rounded-md border bg-secondary p-4 text-secondary-foreground"
>
	<OsteopathForm courses={data.courses} {form} />
</dialog>
