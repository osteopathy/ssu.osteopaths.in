<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index";
  import { Button } from "$lib/components/ui/button";
  import { DotsHorizontal } from "radix-icons-svelte";
  export let id: string;
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button
      variant="ghost"
      builders={[builder]}
      size="icon"
      class="relative w-8 h-8 p-0"
    >
      <span class="sr-only">Open menu</span>
      <DotsHorizontal class="w-4 h-4" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
        Copy Osteopath Id
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item on:click={() => dispatch('update')}>Update Details</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>