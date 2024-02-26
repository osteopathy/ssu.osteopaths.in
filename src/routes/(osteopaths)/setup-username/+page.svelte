<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { toast } from 'svelte-sonner';
	import slugify from '$lib/utils/slugify';

	let loading = false;
	let username = '';
</script>

<main class="w-full max-w-5xl p-4">
	<form
		method="post"
		action="/?/username"
		use:enhance={() => {
			loading = true;
			toast.loading('Submitting Username!');
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
				if (result.status === 200) {
					toast.success('Username Successfully Updated!');
					goto(`/${result.data.username}`);
				} else {
					// @ts-ignore
					toast.error(result.data.message);
				}
				// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
			};
		}}
	>
		<Label for="username">Username</Label>
		<Input id="username" bind:value={username} name="username" />
		<Button disabled={loading} type="submit" class="mt-6">Submit</Button>
	</form>
</main>
