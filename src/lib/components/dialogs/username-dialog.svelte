<script lang="ts">
	import Input from '../ui/input/input.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Pencil2 } from 'radix-icons-svelte';
	import { enhance } from '$app/forms';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import { mediaQuery } from 'svelte-legos';
	import { toast } from 'svelte-sonner';

	const isDesktop = mediaQuery('(min-width: 624px)');

	export let open = true;
	export let buttonVisible = false;

	let loading = false;
</script>

{#if $isDesktop}
	<Dialog.Root bind:open>
		{#if buttonVisible}
			<Dialog.Trigger
				class={buttonVariants({
					size: 'responsive',
					class: 'items-center gap-x-2 rounded-full bg-indigo-500 text-white hover:bg-indigo-600'
				})}
			>
				<Pencil2 /> Username
			</Dialog.Trigger>
		{/if}
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Set Username</Dialog.Title>
				<Dialog.Description>
					username are similar to instagram username, helps to identify you!
				</Dialog.Description>
			</Dialog.Header>
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
							open = false;
							toast.success('Username Successfully Updated!');
						} else {
							// @ts-ignore
							toast.error(result.data.message);
						}
						// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
					};
				}}
			>
				<Input id="username" name="username" />
				<Button disabled={loading} type="submit" class="mt-6">Submit</Button>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root
		bind:open
		shouldScaleBackground
		direction="left"
		onOutsideClick={() => (open = !open)}
	>
		{#if buttonVisible}
			<Drawer.Trigger
				class={buttonVariants({
					size: 'responsive',
					class:
						'absolute bottom-4 right-4 items-center gap-x-2 bg-indigo-500 text-white hover:bg-indigo-600'
				})}
			>
				<Pencil2 /> Username
			</Drawer.Trigger>
		{/if}
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Dialog.Title>Set Username</Dialog.Title>
				<Dialog.Description>
					username are similar to instagram username, helps to identify you!
				</Dialog.Description>
			</Drawer.Header>
			<form
			method="post"
			action="/?/username"
			use:enhance={() => {
				loading = true;
				toast.loading('Submitting Feedback!');
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
						toast.success('Username Successfully Updated!');
					} else {
						// @ts-ignore
						toast.error(result.data.message);
					}
					// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
				};
			}}
		>
			<Input id="username" name="username" />
			<Button disabled={loading} type="submit" class="mt-6">Submit</Button>
		</form>
		</Drawer.Content>
	</Drawer.Root>
{/if}