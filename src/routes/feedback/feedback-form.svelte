<script lang="ts">
	import { enhance } from '$app/forms';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let loading = false;
</script>

<form
	method="post"
	action="/feedback/?"
	use:enhance={() => {
		loading = true;
		return async ({ result, update }) => {
			// `result` is an `ActionResult` object
			await update();
			dispatch('update', result)
			loading = false;
			// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
		};
	}}
>
	<div class="grid w-full items-center gap-4">
		<Textarea id="feedback" name="feedback" minlength={30} />
		<fieldset class="flex gap-x-2">
			{#each ['issue', 'idea', 'others'] as option}
				<div class="flex items-center gap-x-3">
					<input
						id={option}
						name="rate-syllabus"
						type="radio"
						value={option}
						checked={option === 'issue'}
						class="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
					/>
					<label for={option} class="block text-sm font-medium leading-6">
						{option}
					</label>
				</div>
			{/each}
		</fieldset>
	</div>
	<Button disabled={loading} type="submit" class="mt-6">Submit</Button>
</form>
