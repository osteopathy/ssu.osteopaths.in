<script lang="ts">
	import { type Course } from "$lib/db/schema"
	import { createTable, Render, Subscribe } from "svelte-headless-table"
	import { readable } from "svelte/store"
	export let data: Course[] = []
	const table = createTable(readable(data))
	const columns = table.createColumns([
		table.column({
			accessor: "name",
			header: "Name",
		}),
		table.column({
			accessor: "duration",
			header: "Duration",
		}),
		// table.column({
		// 	accessor: ({ id, osteopath, phone_number }) => ({
		// 		id,
		// 		isOsteopath: osteopath?.id ? true : false,
		// 		phone_number,
		// 	}),
		// 	header: "",
		// 	cell: ({ value: { id, isOsteopath, phone_number } }) => {
		// 		return createRender(DataTableActions, {
		// 			id,
		// 			isOsteopath,
		// 			phoneNumber: phone_number,
		// 		})
		// 	},
		// }),
	])
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
		table.createViewModel(columns)
</script>

<div class="rounded-md border">
	<table class="min-w-full divide-y divide-gray-300" {...$tableAttrs}>
		<thead>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<th
									scope="col"
									class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
									{...attrs}
								>
									{#if cell.id === "amount"}
										<div class="text-right">
											<Render of={cell.render()} />
										</div>
										<!-- {:else if cell.id === 'email'}
										<Button variant="ghost" on:click={props.sort.toggle}>
											<Render of={cell.render()} />
											<ArrowUpDown class={'ml-2 h-4 w-4'} />
										</Button> -->
									{:else}
										<Render of={cell.render()} />
									{/if}
								</th>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</thead>
		<tbody class="divide-y divide-gray-200" {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<td
									class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
									{...attrs}
								>
									<Render of={cell.render()} />
								</td>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</tbody>
	</table>
</div>
