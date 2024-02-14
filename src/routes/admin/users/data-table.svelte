<script lang="ts">
	import type { User, CreateUserSchema } from '$lib/db/schema';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	import AddUserForm from './user-form.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let data: User[] = [];
	export let form: SuperValidated<CreateUserSchema>;
	let dialogEl: HTMLDialogElement;
	let selectedUserId = '';

	const table = createTable(readable(data));

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'name',
			header: 'Name'
		}),
		table.column({
			accessor: 'gmail',
			header: 'Gmail'
		}),
		table.column({
			accessor: 'role',
			header: 'Role'
		}),
		table.column({
			accessor: (user) => user,
			header: '',
			cell: ({ value: user }) => {
				return createRender(DataTableActions, { id: user.id }).on('update', () => {
					selectedUserId = user.id;
					dialogEl.showModal();
				});
			}
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<dialog
	bind:this={dialogEl}
	class="w-full max-w-xs rounded-md border bg-secondary p-4 text-secondary-foreground"
>
	<AddUserForm userId={selectedUserId} formType="update-user" {form} />
</dialog>
