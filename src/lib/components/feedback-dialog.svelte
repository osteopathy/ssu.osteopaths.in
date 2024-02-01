<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { ChatBubble } from 'radix-icons-svelte';
	import { enhance } from '$app/forms';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { mediaQuery } from 'svelte-legos';
	import { toast } from 'svelte-sonner';

	const isDesktop = mediaQuery('(min-width: 624px)');

	let open = false;
	let loading = false;
</script>

{#if $isDesktop}
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
				toast.loading('Submitting Feedback!');
				return async ({ result, update }) => {
					// `result` is an `ActionResult` object
					await update();
					loading = false;
					toast.success('Feedback Submitted!')
					open = false;
					// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
				};
			}}
		>
			<div class="grid w-full items-center gap-4">
				<Textarea id="content" name="content" />
				<fieldset class="flex gap-x-2">
					{#each ['issue', 'idea', 'others'] as option}
						<div class="flex items-center gap-x-3">
							<input
								id={option}
								name="category"
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
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger
			class={buttonVariants({
				size: 'responsive',
				class:
					'absolute bottom-4 right-4 items-center gap-x-2 bg-indigo-500 text-white hover:bg-indigo-600'
			})}
		>
			<ChatBubble /> Give Feedback</Drawer.Trigger
		>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>Give Feedback</Drawer.Title>
				<Drawer.Description>We're Not Mind Readers (Yet): Tell Us What You Think!</Drawer.Description>
			</Drawer.Header>
			<form
			method="post"
			action="/?/feedback"
			use:enhance={() => {
				loading = true;
				toast.loading('Submitting Feedback!');
				return async ({ result, update }) => {
					// `result` is an `ActionResult` object
					await update();
					loading = false;
					toast.success('Feedback Submitted!')
					open = false;
					// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
				};
			}}
			class="p-4"
		>
			<div class="grid w-full items-center gap-4">
				<Textarea id="content" name="content" />
				<fieldset class="flex gap-x-2">
					{#each ['issue', 'idea', 'others'] as option}
						<div class="flex items-center gap-x-3">
							<input
								id={option}
								name="category"
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
		</Drawer.Content>
	</Drawer.Root>
{/if}
