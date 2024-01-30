<script lang="ts">
    import type { Osteopath, CreateOsteopathSchema } from "$lib/db/schema";
    import { createTable, Render, Subscribe, createRender } from "svelte-headless-table";
    import { readable } from "svelte/store";
    import * as Table from "$lib/components/ui/table";
    import DataTableActions from "./data-table-actions.svelte";
	  import OsteopathForm from "./osteopath-form.svelte";
  	import type { SuperValidated } from "sveltekit-superforms";

    import { addSortBy } from "svelte-headless-table/plugins";
    import { CaretSort } from "radix-icons-svelte";
	import Button from "$lib/components/ui/button/button.svelte";

    export let data: (Osteopath&{user:{name:string}})[] = [];
    export let form: SuperValidated<CreateOsteopathSchema>;
    let dialogEl:HTMLDialogElement;

    const table = createTable(readable(data),{
      sort: addSortBy()
    });

    const columns = table.createColumns([

    table.column({
      accessor: "id",
      header: "ID",
      plugins: {
        sort: {
          disable: true
        }
      }
    }),
    table.column({
      accessor: ({ user }) => user.name,
      header: "Full Name",
      plugins: {
        sort: {
          disable: true
        }
      }
    }),
    table.column({
      accessor: "username",
      header: "Username",
      plugins: {
        sort: {
          disable: true
        }
      }
    }),
    table.column({
      accessor: "course",
      header: "Course",
      plugins: {
        sort: {
          disable: true
        }
      }
    }),
    table.column({
      accessor: "batch",
      header: "Batch"
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "",
      cell: ({ value:osteopathId }) => {
        return createRender(DataTableActions, {id:osteopathId})
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
                <Subscribe
                  attrs={cell.attrs()}
                  let:attrs
                  props={cell.props()}
                  let:props
                >
                  <Table.Head {...attrs}>
                    {#if cell.id === "batch"}
                      <Button variant="ghost" class="" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        <CaretSort class={"ml-2 h-4 w-4"} />
                      </Button>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
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
                    {#if cell.id === "batch"}
                      <div class="ml-4 font-medium">
                        <Render of={cell.render()} />
                      </div>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
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
	<OsteopathForm formType="update-osteopath" form={form} />
</dialog>