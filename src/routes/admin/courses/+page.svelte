<script lang="ts">
	import type { PageData } from "./$types"
	import { enhance } from "$app/forms"
	import DataTable from "./data-table.svelte"
	export let data: PageData

	let dialogEl: HTMLDialogElement
	let loading = false
</script>

<!-- Implementing User:Delete -->
<div class="max-w-5xl w-full px-4">
	<div class="sm:flex sm:items-center mb-10">
		<div class="sm:flex-auto">
			<h1 class="text-base font-semibold leading-6 text-layer-12">Courses</h1>
			<p class="mt-2 text-sm text-layer-11">A list of all the courses</p>
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				on:click={() => dialogEl.showModal()}
				class="bg-indigo-500 hover:bg-indigo-600 scale-105 active:scale-100 transition-all dark:text-white"
			>
				<span class="h-[18px]">Add Course</span>
			</button>
		</div>
	</div>
	{#await data.courses.data}
		Loading ...
	{:then courses}
		<DataTable data={courses} />
	{/await}
</div>

<dialog
	bind:this={dialogEl}
	class="p-4 w-full max-w-xs rounded-md bg-layer-3 backdrop:backdrop-blur-sm border border-layer-7"
>
	<form
		method="post"
		action="?/create"
		use:enhance={() => {
			loading = true
			return async ({ update }) => {
				await update()
				loading = false
				dialogEl.close()
			}
		}}
	>
		{#each ["Course Name", "Course Duration"] as fieldName}
			{@const name = fieldName.toLowerCase().replace(" ", "-")}
			<div class="mb-4">
				<label
					for={name}
					class="block text-sm font-medium leading-6 text-layer-10 sr-only"
				>
					{fieldName}
				</label>
				<div class="mt-1">
					<input
						type="text"
						id={name}
						{name}
						required
						min="3"
						autocomplete={null}
						placeholder={fieldName}
						class="appearance-none block w-full bg-layer-2 text-layer-12 caret-layer-12 rounded-md py-2 border-0 shadow-sm shadow-layer-1 ring-1 ring-inset ring-layer-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-layer-9"
					/>
				</div>
			</div>
		{/each}
		<div class="inline-flex gap-x-4 mt-4">
			<button
				value="cancel"
				on:click={() => dialogEl.close()}
				formmethod="dialog"
			>
				Cancel
			</button>
			<button type="submit" disabled={loading} class="gap-x-1"> Submit </button>
		</div>
	</form>
</dialog>
