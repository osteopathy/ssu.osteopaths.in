<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ChatBubble } from 'radix-icons-svelte';
	import FeedbackForm from './feedback-form.svelte';
	let open = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ size: 'responsive', class:'absolute bottom-4 right-4 bg-indigo-500 hover:bg-indigo-600 text-white gap-x-2 items-center' })}> <ChatBubble/> Give Feedback</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Give Feedback</Dialog.Title>
			<Dialog.Description>
				We're Not Mind Readers (Yet): Tell Us What You Think! 
			</Dialog.Description>
		</Dialog.Header>
		<FeedbackForm on:update={() => open = false} />
	</Dialog.Content>
</Dialog.Root>
