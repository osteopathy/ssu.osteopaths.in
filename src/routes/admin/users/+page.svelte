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
			<h1 class="text-base font-semibold leading-6 text-layer-12">Users</h1>
			<p class="mt-2 text-sm text-layer-11">
				A list of all the users in your account including their name, title,
				email and role.
			</p>
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				on:click={() => dialogEl.showModal()}
				class="bg-indigo-500 hover:bg-indigo-600 scale-105 active:scale-100 transition-all dark:text-white"
			>
				<span class="h-[18px]">Add User</span>
			</button>
		</div>
	</div>
	{#await data.users.data}
		Loading ...
	{:then users}
		<DataTable data={users} />
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
		{#each ["Full Name", "Phone Number", "Password"] as fieldName}
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
						autocomplete="given-name"
						placeholder={fieldName}
						class="appearance-none block w-full bg-layer-2 text-layer-12 caret-layer-12 rounded-md py-2 border-0 shadow-sm shadow-layer-1 ring-1 ring-inset ring-layer-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-layer-9"
					/>
				</div>
			</div>
		{/each}
		<div class="relative pl-1 flex items-start">
			<div class="flex h-6 items-center">
				<input
					id="is-osteopath"
					name="is-osteopath"
					type="checkbox"
					class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
				/>
			</div>
			<div class="ml-3 text-sm sm:text-base leading-6">
				<label for="is-osteopath" class="font-medium text-layer-12"
					>osteopath ?</label
				>
			</div>
		</div>
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
