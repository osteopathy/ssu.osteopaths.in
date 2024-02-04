<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Pencil2 } from 'radix-icons-svelte';
	import { enhance } from '$app/forms';
	import Input from './ui/input/input.svelte';
	let open = false;
	let loading = false;

    let errorMessage = ""
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={buttonVariants({
			size: 'responsive',
			class:
				'items-center w-max m-2 gap-x-2 bg-indigo-500 text-white hover:bg-indigo-600'
		})}
	>
		<Pencil2 /> Username 
    </Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Fill Username</Dialog.Title>
		</Dialog.Header>
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
                    if (result.status === 200) {
                        open = false;
                    } else {
                        // @ts-ignore
                        errorMessage = result.data.message;
                    }
					// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
				};
			}}
		>
			<Input id="username" name="username" />
            <p class="text-red-500">{errorMessage}</p>
			<Button disabled={loading} type="submit" class="mt-6">Submit</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
