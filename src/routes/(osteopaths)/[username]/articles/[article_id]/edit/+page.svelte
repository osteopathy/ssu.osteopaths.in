<script lang="ts">
	import { page } from '$app/stores';
	import { Editor } from '$lib/components/editor';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { UploadCloudIcon, MoreVerticalIcon, Trash2Icon, Undo2Icon } from 'lucide-svelte';
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	let saveStatus = 'Saved';
	let delLabel = 'Delete';

	export let data: PageServerData;
</script>

<main class="flex flex-col w-full relative p-4 max-w-5xl">
	<div class="w-full flex justify-between mb-4">
		<div></div>
		<div class="flex gap-x-4">
			{#if data?.article?.draft}
				<form method="POST" action="?/publish" use:enhance>
					<Button type="submit" class="gap-x-2">
						<span>Publish</span>
						<UploadCloudIcon />
					</Button>
				</form>
			{:else}
				<form method="POST" action="?/unpublish" use:enhance>
					<Button type="submit" class="gap-x-2">
						<span>UnPublish</span>
						<Undo2Icon />
					</Button>
				</form>
			{/if}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="outline" size="icon"><MoreVerticalIcon /></Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<form
						method="POST"
						action="?/delete"
						use:enhance={() => {
							delLabel = 'Deleting';
							return async (e) => {
							await e.update();
								goto(`../`)
							};
						}}
					>
						<Button
							type="submit"
							disabled={delLabel === 'Deleting'}
							variant="destructive"
							class="w-full justify-between"
						>
							<span>Delete</span>
							<span><Trash2Icon size={20} /></span>
						</Button>
					</form>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	<Editor
		storageKey={$page.params.articleId}
		defaultValue={data.article.title ?? undefined}
		onUpdate={() => {
			saveStatus = 'Unsaved';
		}}
		onDebouncedUpdate={async (editor) => {
			saveStatus = 'Saving...';
			const title = editor?.view.state.doc.firstChild?.textContent;
			const summary = editor?.view.state.doc.child(1).textContent;
			title && $page.url.searchParams.set('title', title);
			summary && $page.url.searchParams.set('summary', summary);

			await fetch($page.url, {
				method: 'PUT',
				body: JSON.stringify(editor?.getJSON())
			});
			saveStatus = 'Saved';
		}}
	>
		<div
			class="absolute bg-layer-3 right-3 top-3 z-10 mb-5 rounded-lg px-2 py-1 text-sm text-layer-10"
		>
			{saveStatus}
		</div>
	</Editor>
</main>
