<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { Select as SelectPrimitive } from 'bits-ui';
	import { getFormField } from 'formsnap';
	import { Render, createRender } from 'svelte-render';
	import { Clock } from 'radix-icons-svelte';

	type $$Props = SelectPrimitive.TriggerProps & {
		placeholder?: string;
		icon?: typeof Clock;
	};
	type $$Events = SelectPrimitive.TriggerEvents;
	const { attrStore, value } = getFormField();
	export let placeholder = '';
	export let icon = Clock;
</script>

<Select.Trigger
	{...$$restProps}
	{...$attrStore}
	on:click
	on:keydown
	class="h-input rounded-9px inline-flex w-[144px] items-center border bg-background px-[11px] text-sm transition-colors placeholder:text-foreground-alt/50  focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
	aria-label="Select a theme"
>
	<Render of={createRender(icon, { class: 'mr-[9px] text-muted-foreground size-4' })} />
	<slot value={$value}>
		<Select.Value class="text-sm" {placeholder} />
	</slot>
</Select.Trigger>
