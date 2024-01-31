<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ChatBubble } from 'radix-icons-svelte';
	import { enhance } from '$app/forms';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	let open = false;
	let loading = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={buttonVariants({
			size: 'responsive',
			class:
				'absolute bottom-4 right-4 items-center gap-x-2 bg-indigo-500 text-white hover:bg-indigo-600'
		})}
	>
		<ChatBubble /> Give Feedback</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Give Feedback</Dialog.Title>
			<Dialog.Description>We're Not Mind Readers (Yet): Tell Us What You Think!</Dialog.Description>
		</Dialog.Header>
		<form
			method="post"
			action="/?/feedback"
			use:enhance={() => {
				loading = true;
				return async ({ result, update }) => {
					// `result` is an `ActionResult` object
					await update();
					loading = false;
					open = false;
					// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
				};
			}}
		>
			<div class="grid w-full items-center gap-4">
				<Textarea id="feedback" name="feedback" />
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
	</Dialog.Content>
</Dialog.Root>
