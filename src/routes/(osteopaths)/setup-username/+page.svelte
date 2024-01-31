<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let loading = false;
	let errorMessage = '';
</script>

<main class="w-full max-w-5xl flex flex-col items-center">
	<div class="max-w-sm">
	<form
		method="post"
		action="/?/username"
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				// `result` is an `ActionResult` object
				// result.status -> status
				// 400 -> Bad Request
				// 401 -> unauthorized
				// 409 -> username already exists
				// 200 -> username changed successfully
				// 500 -> server error
				await update();
				loading = false;
				// @ts-ignore
				errorMessage = result.data?.message;
				// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
			};
		}}
>
		<Label for="username">Username</Label>
		<Input id="username" name="username" />
		<p class="text-red-500">{errorMessage}</p>
		<Button disabled={loading} type="submit" class="mt-6">Submit</Button>
	</form>
</div>
</main>
