<script lang="ts">
    import type { Feedback, CreateFeedbackSchema } from "$lib/db/schema";
    import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
    import { readable } from "svelte/store";
    import * as Table from "$lib/components/ui/table";
    import DataTableActions from "./data-table-actions.svelte";
	  import AddFeedbackForm from "./feedback-form.svelte";
  	import type { SuperValidated } from "sveltekit-superforms";

    export let data: Feedback[] = [];
    export let form: SuperValidated<CreateFeedbackSchema>;
    let dialogEl:HTMLDialogElement;
    let selectedFeedbackId = "";

    const table = createTable(readable(data));

    const columns = table.createColumns([

    table.column({
      accessor: ({ user }) => user.name,
      header: "User Name"
    }),
    table.column({
      accessor: "userId",
      header: "User ID"
    }),
    table.column({
      accessor: "category",
      header: "Category"
    }),
    table.column({
      accessor: "content",
      header: "Content"
    }),
    table.column({
      accessor: (feedback) => feedback,
      header: "",
      cell: ({ value:feedback }) => {
        return createRender(DataTableActions, {id:feedback.id}).on('update',() => {
          selectedFeedbackId = feedback.id;
          dialogEl.showModal()
        });
      }
    })
  ]);
  const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);
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
	class="p-4 w-full max-w-xs rounded-md border bg-secondary text-secondary-foreground"
>
	<AddFeedbackForm feedbackId={selectedFeedbackId} formType="update-feedback" form={form} />
</dialog>