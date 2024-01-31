<script lang="ts">
	import type { CreateFeedbackSchema } from '$lib/db/schema'
	import type { SuperValidated } from 'sveltekit-superforms';
	import AddFeedbackForm from './feedback-form.svelte';
    import DataTable from './data-table.svelte';
    export let form: SuperValidated<CreateFeedbackSchema>;
	export let data;
	let dialogEl: HTMLDialogElement;
</script>

<div class="mb-8 sm:flex sm:items-center">
	<div class="sm:flex-auto">
		<h1 class="text-base font-semibold leading-6">Feedbacks</h1>
		<p class="mt-2 text-sm text-muted-foreground">
			A list of all the feedbacks in osteopathy offered by Sri Sri University
		</p>
	</div>
	<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
		<button
            on:click={() => dialogEl.showModal()}
			type="button"
			class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
            Add Feedback
        </button>
	</div>
</div>

<DataTable data={data.feedbacks} form={form} />

<dialog
	bind:this={dialogEl}
	class="p-4 w-full max-w-xs rounded-md border bg-secondary text-secondary-foreground"
>
    <AddFeedbackForm form={form} />
</dialog>